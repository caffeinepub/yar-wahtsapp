import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type MessageId = Int;
  type Timestamp = Time.Time;

  public type ConversationId = Text;
  public type Message = {
    id : MessageId;
    sender : Principal;
    content : Text;
    timestamp : Timestamp;
  };

  public type Conversation = {
    id : ConversationId;
    participants : (Principal, Principal);
    messages : Map.Map<MessageId, Message>;
  };

  public type UserProfile = {
    name : Text;
    avatar : ?Text;
  };

  public type ConversationView = {
    id : ConversationId;
    participants : (Principal, Principal);
    messages : [Message];
  };

  let conversations = Map.empty<ConversationId, Conversation>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Conversation {
    public func compareByTimestamp(conversation1 : Conversation, conversation2 : Conversation) : Order.Order {
      let conversation1LastMessage = switch (conversation1.messages.maxEntry()) {
        case (null) { return #greater };
        case (?entry) { ?entry.1 };
      };
      let conversation2LastMessage = switch (conversation2.messages.maxEntry()) {
        case (null) { return #greater };
        case (?entry) { ?entry.1 };
      };

      switch (conversation1LastMessage, conversation2LastMessage) {
        case (null, null) { #equal };
        case (null, ?_) { #less };
        case (?_, null) { #greater };
        case (?message1, ?message2) {
          Int.compare(message2.timestamp, message1.timestamp);
        };
      };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Messaging Functions
  public shared ({ caller }) func startConversationWith(to : Principal) : async ConversationId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start conversations");
    };

    if (caller == to) {
      Runtime.trap("Cannot start a conversation with yourself");
    };

    let conversation = findConversation(caller, to);
    switch (conversation) {
      case (?conv) { return conv.id };
      case (null) {};
    };

    // Use current timestamp for UUID. Attempt to use (timestamp + 1) if already in use.
    let timestamp = Time.now();
    let newConversationId = if (conversations.containsKey(timestamp.toText())) {
      (timestamp + 1).toText();
    } else {
      timestamp.toText();
    };

    let newConversation : Conversation = {
      id = newConversationId;
      participants = (caller, to);
      messages = Map.empty<MessageId, Message>();
    };

    conversations.add(newConversationId, newConversation);
    newConversationId;
  };

  public query ({ caller }) func getConversationsByMostRecentMessage() : async [ConversationView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    // Filter to only conversations where caller is a participant
    let callerConversations = conversations.values()
      .filter(func(conv : Conversation) : Bool {
        conv.participants.0 == caller or conv.participants.1 == caller
      })
      .toArray()
      .sort(Conversation.compareByTimestamp)
      .map(
        func(conv) {
          {
            id = conv.id;
            participants = conv.participants;
            messages = conv.messages.values().toArray();
          };
        }
      );

    callerConversations;
  };

  public shared ({ caller }) func sendMessage(conversationId : ConversationId, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) {
        Runtime.trap("Conversation not found");
      };
      case (?conversation) {
        let participants = conversation.participants;
        if (caller != participants.0 and caller != participants.1) {
          Runtime.trap("Unauthorized: Only participants can send messages in this conversation");
        };

        if (Text.equal(content.trim(#char ' '), "")) {
          Runtime.trap("Cannot send empty message");
        };

        let messageId = Time.now();
        let timestamp = Time.now();

        let message : Message = {
          id = messageId;
          sender = caller;
          content;
          timestamp;
        };

        conversation.messages.add(messageId, message);
      };
    };
  };

  public query ({ caller }) func getMessages(conversationId : ConversationId, page : Nat, pageSize : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) { [] };
      case (?conversation) {
        // Verify caller is a participant in this conversation
        let participants = conversation.participants;
        if (caller != participants.0 and caller != participants.1) {
          Runtime.trap("Unauthorized: Only participants can view messages in this conversation");
        };

        let messages = conversation.messages.values().toArray();
        let start = page * pageSize;
        if (start >= messages.size()) {
          return [];
        };
        let end = if (start + pageSize > messages.size()) {
          messages.size();
        } else {
          start + pageSize;
        };
        messages.sliceToArray(start, end);
      };
    };
  };

  func findConversation(user1 : Principal, user2 : Principal) : ?Conversation {
    let conversationsIter = conversations.entries();
    var foundConversation : ?Conversation = null;

    conversationsIter.forEach(func((_, conversation)) {
      if (conversation.participants.0 == user1 and conversation.participants.1 == user2) {
        foundConversation := ?conversation;
      };
    });

    switch (foundConversation) {
      case (?_) { foundConversation };
      case (null) {
        conversationsIter.forEach(func((_, conversation)) {
          if (conversation.participants.0 == user2 and conversation.participants.1 == user1) {
            foundConversation := ?conversation;
          };
        });
        foundConversation;
      };
    };
  };
};
