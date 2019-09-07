({
    handleUploadFinished: function (cmp, event) {
        // This will contain the List of File uploaded data and status
        console.log('added image in upload');
        let eve = cmp.getEvent('addedMovieImage');
        eve.setParams({});
        eve.fire();
    },   // Load current profile picture
    onInit: function (component) {
        let action = component.get("c.getProfilePicture");
        action.setParams({
            parentId: component.get("v.recordId"),
        });
        action.setCallback(this, function (a) {
            let attachment = a.getReturnValue();
            console.log(attachment);
            if (attachment && attachment.Id) {
                component.set('v.pictureSrc', '/servlet/servlet.FileDownload?file='
                    + attachment.Id);
            }
        });
        $A.enqueueAction(action);
    },

    onDragOver: function (component, event) {
        event.preventDefault();
    },

    onDrop: function (component, event, helper) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        let files = event.dataTransfer.files;
        if (files.length > 1) {
            return alert("You can only upload one profile picture");
        }
        helper.readFile(component, helper, files[0]);
    },
    onChangeFile: function (component, event, helper) {

        let uploadFile = event.getSource().get("v.files")[0];
        if (uploadFile) {
            console.log('got f');
        }
        console.log(uploadFile);

    }
});