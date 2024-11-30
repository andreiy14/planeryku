import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import List "mo:base/List";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";
actor Tasks {

    public type Tasks = {
        id : Text;
        name : Text;
        status : Text;
        description : Text;
        createDate : Text;
        projectId : Text;

    };
    private stable var listTaskStable : [(Text, Tasks)] = [];

    var listTasks = HashMap.HashMap<Text, Tasks>(1, Text.equal, Text.hash);

    // function to add Tasks
    public func addTasks(task : Tasks) : async Text {
        try {
            let source = Source.Source();
            let uuid = UUID.toText(await source.new());

            let newTask = {
                id = uuid;
                name = task.name;
                status = task.status;
                description = task.description;
                createDate = task.createDate;
                projectId = task.projectId;
            };
            listTasks.put(uuid, newTask);
            return "Task created: " # task.name # " with ID " # task.id;

        } catch (e) {

            throw e;
        };
    };

    public func editTask({
        taskId : Text;
        name : Text;
        description : Text;
        status : Text;
    }) : async Text {
        switch (listTasks.get(taskId)) {
            case (null) {
                "Task not found";
            };
            case (?task) {
                let updatedTask = {
                    id = task.id;
                    status = status;
                    createDate = task.createDate;
                    name = name;
                    description = description;
                    projectId = task.projectId;
                };
                listTasks.put(taskId, updatedTask);
                "Task updated";
            };
        };
    };

    public func updateTaskStatus(taskId : Text, newStatus : Text) : async Text {
        switch (listTasks.get(taskId)) {
            case (null) {
                "Task not found";
            };
            case (?task) {

                listTasks.put(taskId, { task with status = newStatus });
                "Status updated";
            };
        };
    };

    public query func searchTasksByName(name : Text) : async {
        readyToDeploy : [Tasks];
        open : [Tasks];
        inProgress : [Tasks];
        readyToTest : [Tasks];
    } {

        var result = {
            var readyToDeploy : [Tasks] = [];
            var open : [Tasks] = [];
            var inProgress : [Tasks] = [];
            var readyToTest : [Tasks] = [];
        };

        for ((_, tasks) in listTasks.entries()) {
            if (Text.contains(tasks.name, #text name)) {
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
                    case (_) {};
                };
            };
        };

        return {
            readyToDeploy = result.readyToDeploy;
            open = result.open;
            inProgress = result.inProgress;
            readyToTest = result.readyToTest;
        };
    };

    public query func filterTaskByStatus(status : Text) : async [Tasks] {
        var result : [Tasks] = [];

        for ((_, task) in listTasks.entries()) {
            if (Text.contains(task.status, #text status)) {
                result := Array.append<Tasks>(result, [task]);
            };
        };

        return result;
    };

    // Query function for detail Tasks
    public query func getDetailTasks(taskId : Text) : async ?Tasks {

        if (listTasks.get(taskId) == null) {
            return null;
        };

        return listTasks.get(taskId);
    };

    // Query function to map and return data by status
    public query func getTasks(idProject : Text) : async [Tasks] {


        var result : List.List<Tasks> = List.nil<Tasks>();

        for ((_, task) in listTasks.entries()) {
            if (task.projectId == idProject) {
                result := List.push<Tasks>(task, result);
            }

        };
        

    return List.toArray<Tasks>(result);
    };

    system func preupgrade() {
        listTaskStable := Iter.toArray(listTasks.entries());
        // listTaskStable := []
    };

    system func postupgrade() {
        listTasks := HashMap.fromIter<Text, Tasks>(listTaskStable.vals(), 1, Text.equal, Text.hash);
    };

};
