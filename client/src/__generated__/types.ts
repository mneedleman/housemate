import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type FrequencyEnum =
  | 'day'
  | 'days'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks';

export type LeftoverFragment = { id: string, name: string, allergens: string | null, useBy: string | null, trashBy: string | null };

export type TimelineItemFragment = { id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } };

export type CompleteTimelineItemMutationVariables = Exact<{
  id: string | number;
}>;


export type CompleteTimelineItemMutation = { completeTimelineItem: { id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } } | null };

export type CreateHouseholdMutationVariables = Exact<{
  name: string;
  makeCurrent?: boolean | null | undefined;
}>;


export type CreateHouseholdMutation = { createHousehold: { id: string, name: string, users: Array<{ name: string | null, email: string }> | null } | null };

export type CreateLeftoverMutationVariables = Exact<{
  name: string;
  trashBy: string;
  allergens?: string | null | undefined;
  useBy?: string | null | undefined;
}>;


export type CreateLeftoverMutation = { createLeftover: { id: string, name: string, allergens: string | null, useBy: string | null, trashBy: string | null } | null };

export type CreateTimelineItemMutationVariables = Exact<{
  title: string;
  body?: string | null | undefined;
  frequencyUnit?: FrequencyEnum | null | undefined;
  frequencyValue?: number | null | undefined;
  lastCompletedAt?: string | null | undefined;
}>;


export type CreateTimelineItemMutation = { createTimelineItem: { id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } } | null };

export type DeleteHouseholdMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteHouseholdMutation = { deleteHousehold: boolean | null };

export type DeleteTimelineItemMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTimelineItemMutation = { deleteTimelineItem: boolean };

export type EditTimelineItemMutationVariables = Exact<{
  id: string | number;
  title: string;
  body?: string | null | undefined;
  frequencyUnit?: FrequencyEnum | null | undefined;
  frequencyValue?: number | null | undefined;
  lastCompletedAt?: string | null | undefined;
}>;


export type EditTimelineItemMutation = { editTimelineItem: { id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } } };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { token?: string | null } | null };

export type SetHouseholdMutationVariables = Exact<{
  id: string | number;
}>;


export type SetHouseholdMutation = { setHousehold: { id: string, name: string, users: Array<{ name: string | null, email: string }> | null } | null };

export type SignupMutationVariables = Exact<{
  email: string;
  password: string;
  name: string;
}>;


export type SignupMutation = { signup: { token?: string | null } | null };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser: { email: string, name: string | null, householdId: string | null } | null };

export type HouseholdsQueryVariables = Exact<{ [key: string]: never; }>;


export type HouseholdsQuery = { households: Array<{ id: string, name: string, users: Array<{ name: string | null, email: string }> | null }> | null };

export type LeftoversQueryVariables = Exact<{ [key: string]: never; }>;


export type LeftoversQuery = { leftovers: Array<{ id: string, name: string, allergens: string | null, useBy: string | null, trashBy: string | null }> | null };

export type TestFieldQueryVariables = Exact<{ [key: string]: never; }>;


export type TestFieldQuery = { testField: string };

export type TimelineItemQueryVariables = Exact<{
  id: string | number;
}>;


export type TimelineItemQuery = { timelineItem: { id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } } };

export type TimelineItemsQueryVariables = Exact<{
  householdIds?: Array<string | number> | string | number | null | undefined;
}>;


export type TimelineItemsQuery = { timelineItems: Array<{ id: string, title: string, body: string | null, dueAt: string | null, lastCompletedAt: string | null, frequency: string | null, frequencyUnit: string | null, frequencyValue: number | null, household: { id: string, name: string } }> | null };

export const LeftoverFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leftover"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Leftover"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"allergens"}},{"kind":"Field","name":{"kind":"Name","value":"useBy"}},{"kind":"Field","name":{"kind":"Name","value":"trashBy"}}]}}]} as unknown as DocumentNode<LeftoverFragment, unknown>;
export const TimelineItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TimelineItemFragment, unknown>;
export const CompleteTimelineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeTimelineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeTimelineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimelineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CompleteTimelineItemMutation, CompleteTimelineItemMutationVariables>;
export const CreateHouseholdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createHousehold"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"makeCurrent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createHousehold"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"makeCurrent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"makeCurrent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<CreateHouseholdMutation, CreateHouseholdMutationVariables>;
export const CreateLeftoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLeftover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trashBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ISO8601DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allergens"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ISO8601DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLeftover"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"trashBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trashBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"allergens"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allergens"}}},{"kind":"Argument","name":{"kind":"Name","value":"useBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leftover"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leftover"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Leftover"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"allergens"}},{"kind":"Field","name":{"kind":"Name","value":"useBy"}},{"kind":"Field","name":{"kind":"Name","value":"trashBy"}}]}}]} as unknown as DocumentNode<CreateLeftoverMutation, CreateLeftoverMutationVariables>;
export const CreateTimelineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTimelineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequencyUnit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FrequencyEnum"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequencyValue"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastCompletedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ISO8601DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTimelineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequencyUnit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequencyUnit"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequencyValue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequencyValue"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastCompletedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastCompletedAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimelineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateTimelineItemMutation, CreateTimelineItemMutationVariables>;
export const DeleteHouseholdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteHousehold"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteHousehold"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteHouseholdMutation, DeleteHouseholdMutationVariables>;
export const DeleteTimelineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTimelineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTimelineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTimelineItemMutation, DeleteTimelineItemMutationVariables>;
export const EditTimelineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editTimelineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequencyUnit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FrequencyEnum"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequencyValue"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastCompletedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ISO8601DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editTimelineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequencyUnit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequencyUnit"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequencyValue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequencyValue"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastCompletedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastCompletedAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimelineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EditTimelineItemMutation, EditTimelineItemMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const SetHouseholdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setHousehold"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setHousehold"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<SetHouseholdMutation, SetHouseholdMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"householdId"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const HouseholdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"households"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"households"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<HouseholdsQuery, HouseholdsQueryVariables>;
export const LeftoversDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"leftovers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leftovers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Leftover"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Leftover"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Leftover"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"allergens"}},{"kind":"Field","name":{"kind":"Name","value":"useBy"}},{"kind":"Field","name":{"kind":"Name","value":"trashBy"}}]}}]} as unknown as DocumentNode<LeftoversQuery, LeftoversQueryVariables>;
export const TestFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"testField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testField"}}]}}]} as unknown as DocumentNode<TestFieldQuery, TestFieldQueryVariables>;
export const TimelineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timelineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timelineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimelineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TimelineItemQuery, TimelineItemQueryVariables>;
export const TimelineItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timelineItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"householdIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timelineItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"householdIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"householdIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimelineItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimelineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimelineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastCompletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyUnit"}},{"kind":"Field","name":{"kind":"Name","value":"frequencyValue"}},{"kind":"Field","name":{"kind":"Name","value":"household"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TimelineItemsQuery, TimelineItemsQueryVariables>;