import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
actor Authentication {

  private stable var listUserEntries : [(Principal, Text)] = [];

  private var listUsers = HashMap.HashMap<Principal, Text>(1, Principal.equal, Principal.hash);

  public func addUser(userIdentity : Principal, userName : Text) : async Text {
    let user = userIdentity;

    // Check if the caller ID is valid (non-empty in this context)
    if (Principal.isAnonymous(user)) {
      throw Error.reject("Anonymous principal not allowed");
    };
    // If valid, proceed to add the user
    listUsers.put(user, userName);

    return "Success";
  };

  system func preupgrade() {
    listUserEntries := Iter.toArray(listUsers.entries());
    Debug.print(debug_show (listUserEntries));
  };

  system func postupgrade() {

    listUsers := HashMap.fromIter<Principal, Text>(listUserEntries.vals(), 1, Principal.equal, Principal.hash);
  };

};
