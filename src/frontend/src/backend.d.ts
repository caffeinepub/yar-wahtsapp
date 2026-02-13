import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    sender: Principal;
    timestamp: Timestamp;
}
export interface ConversationView {
    id: ConversationId;
    participants: [Principal, Principal];
    messages: Array<Message>;
}
export interface UserProfile {
    name: string;
    avatar?: string;
}
export type ConversationId = string;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversationsByMostRecentMessage(): Promise<Array<ConversationView>>;
    getMessages(conversationId: ConversationId, page: bigint, pageSize: bigint): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: ConversationId, content: string): Promise<void>;
    startConversationWith(to: Principal): Promise<ConversationId>;
}
