import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

actor Tasks {

    public type Tasks = {
        id : Text;
        name : Text;
        status : Text;
        description : Text;
        createDate : Text;

    };
    private stable var listTaskStable : [(Text, Tasks)] = [];

    var listTasks = HashMap.HashMap<Text, Tasks>(1, Text.equal, Text.hash);

    // function to add Tasks
    public shared func addTasks(Tasks : Tasks) : async Text {
        listTasks.put(Tasks.id, Tasks);
        return "Success";
    };

    // Query function for detail Tasks
    public query func getDetailTasks(taskId : Text) : async ?Tasks {

        if (listTasks.get(taskId) == null) {
            return null;
        };

        return listTasks.get(taskId);
    };

    // Query function to map and return data by status
    public query func getTasks() : async {
        readyToDeploy : [Tasks];
        open : [Tasks];
        inProgress : [Tasks];
    } {
        // Initialize the result map with explicit types
        var result = {
            var readyToDeploy : [Tasks] = [];
            var open : [Tasks] = [];
            var inProgress : [Tasks] = [];
            var readyToTest : [Tasks] = [];
        };

        // Iterate through the HashMap and group by status
        for ((_, tasks) in listTasks.entries()) {
            switch (tasks.status) {
                case ("readyToDeploy") {
                    result.readyToDeploy := Array.append<Tasks>(result.readyToDeploy, [tasks]);
                };
                case ("open") {
                    result.open := Array.append<Tasks>(result.open, [tasks]);
                };
                case ("inProgress") {
                    result.inProgress := Array.append<Tasks>(result.inProgress, [tasks]);
                };
                case ("readyToTest") {
                    result.readyToTest := Array.append<Tasks>(result.readyToTest, [tasks]);
                };
                case (_) {}; // Do nothing for other status
            };
        };

        // Return the grouped data (fields automatically converted back to immutable)
        return {
            readyToDeploy = result.readyToDeploy;
            open = result.open;
            inProgress = result.inProgress;
        };
    };

    system func preupgrade() {
        listTaskStable := Iter.toArray(listTasks.entries());
    };

    system func postupgrade() {
        listTasks := HashMap.fromIter<Text, Tasks>(listTaskStable.vals(), 1, Text.equal, Text.hash);
    };

};
