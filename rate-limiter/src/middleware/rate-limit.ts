import { Request, Response, NextFunction } from 'express';
import { isAbstractType, GraphQLInterfaceType, isNonNullType, GraphQLType, GraphQLField, parse, GraphQLList, GraphQLObjectType, GraphQLSchema, TypeInfo, visit, visitWithTypeInfo, StringValueNode, getNamedType, GraphQLNamedType, getEnterLeaveForKind, GraphQLCompositeType, getNullableType, Kind, isListType, DocumentNode } from 'graphql';
import graphql from 'graphql';
import { useSchema } from 'graphql-yoga';

//to-dos
//modularize code, certain functions can be offloaded
//research further into pagination conventions => currently only account for IntValues for first/last/limit
//compare limits found in arguments against both defaultLimit and limits found within schema => defaultLimit case resolved, limits found in schema not resolved
//generate casing for mutations/subscriptions

const rateLimiter = function (config: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    if(req.body.query) {

      const parsedAst = parse(req.body.query);
      let parentTypeStack: any[]= [];
      let complexityScore = 0;
      let typeComplexity = 0;
      let resolveComplexity = 0;
      let currMult = 0;
      const ipAddresses: any = {};
      let reqIP = req.ip
      if (reqIP.includes('::ffff:')) {
        reqIP = reqIP.replace('::ffff:', '');
      }

      visit(parsedAst, visitWithTypeInfo(config.typeInfo, {
        enter(node) {

          //upon entering field, updates the parentTypeStack, which is the stack of all field ancestors of current field node
          if (node.kind === Kind.FIELD) {

            //resets list multiplier upon encountering an empty stack, indicating that a set of nested fields has been exited
            if(parentTypeStack.length === 0) currMult = 0;

            const parentType = config.typeInfo.getParentType();
            if (parentType) {
            const fieldDef = parentType && isAbstractType(parentType) ? config.typeInfo.getFieldDef() : parentType.getFields()[node.name.value];

            if(fieldDef) {
            const fieldDefArgs = fieldDef.args;
            console.log('These are the fieldArgs:', fieldDef.args);
            const fieldType = getNullableType(fieldDef.type);
            // const fieldDirectives = fieldDef.astNode.directives;
            // if(fieldDirectives) {
            //   //@ts-ignore
            //   const cost = fieldDirectives.find(directive => directive.name.value === 'cost');
            // }
            const isList = isListType(fieldType) || (isNonNullType(fieldType) && isListType(fieldType.ofType));

            console.log('This is the currentNode:', node.name.value);
            //functionality upon encountering listType, in short looks for ancestor lists and limit arguments then adjusts currMult accordingly
            if(isList === true) {
              console.log(`${node.name.value} is a list`);
              const argNode = node.arguments?.find(arg => (arg.name.value === 'limit' || arg.name.value === 'first' || arg.name.value === 'last'));
              currMult = config.paginationLimit;
              if (argNode && argNode.value.kind === 'IntValue') {
                const argValue = parseInt(argNode.value.value, 10);
                console.log(`Found limit argument with value ${argValue}`);
                currMult = argValue;
              }
              console.log('Mult is now:', currMult);
              for (let i = parentTypeStack.length-1; i >= 0; i--) {
                if(parentTypeStack[i].isList === true) {
                  //assuming the list is currently nested within another list, adjust resolve complexity by number of list calls
                  //indicated by the multiplier inherited by the previous list
                  resolveComplexity += parentTypeStack[i].currMult;
                  resolveComplexity--;
                  currMult = currMult * parentTypeStack[i].currMult
                  break;
                }
              }

              //base case addition of resolveComplexity, offset in above for-loop for list cases
              resolveComplexity++;
              typeComplexity += currMult;

              //handling for object types, checks for most recent ancestor list's multiplier then adjust accordingly
            } else if (fieldType instanceof GraphQLObjectType) {
              console.log(`This is the parentStack of the graphQLObject type ${node.name.value}`, parentTypeStack);
              for (let i = parentTypeStack.length-1; i >= 0; i--) {
                if(parentTypeStack[i].isList === true) {
                  resolveComplexity += parentTypeStack[i].currMult;
                  resolveComplexity--;
                  currMult = parentTypeStack[i].currMult
                  break;
                }
              }

              //if the currMult === 0 indicates object not nested in list, simply increment complexity score
              if(currMult !== 0) typeComplexity += currMult; else typeComplexity++;
              resolveComplexity++;
            }
            parentTypeStack.push({fieldDef, isList, fieldDefArgs, currMult});
          }
        }
        }
        },
        leave(node) {
          if (node.kind === Kind.FIELD) {
            parentTypeStack.pop();
          }
          console.log('Exiting node')
        }
      }));


      complexityScore = resolveComplexity + typeComplexity;
      if (!ipAddresses[reqIP]) {
        ipAddresses[reqIP] = complexityScore;
      }
      console.log('This is the type complexity', typeComplexity);
      console.log('This is the resolve complexity', resolveComplexity);
      console.log('This is the complexity score:', complexityScore);

      //returns error if complexity heuristic reads complexity score over limit
      if(config.monitor === true) {
        res.locals.complexityScore = complexityScore;
        res.locals.complexityLimit = config.complexityLimit;
        return next();
      }
      if(complexityScore >= config.complexityLimit) {
        console.log('Complexity of this query is too high');
        return next(Error);
      }
    };
return next();
  }
}
export default rateLimiter;
