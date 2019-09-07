({
    readFile: function (component, helper, file) {
        if (!file) return;
        if (!file.type.match(/(image.*)/)) {
            return alert('Image file not supported');
        }

        let reader = new FileReader();
        reader.onloadend = function () {
            let dataURL = reader.result;
            // console.log(dataURL);
            component.set("v.pictureSrc", dataURL);
            helper.upload(component, file, dataURL.match(/,(.*)$/)[1]);
        };
        reader.readAsDataURL(file);
        console.log('started reading');
        // reader.readAsBinaryString(file);
        // helper.upload(component, file, '');
    },

    upload: function (component, file, base64Data) {
        let action = component.get("c.saveAttachment");
        let id = component.get('v.movieId');
        let userId = $A.get("$SObjectType.CurrentUser.Id");
        action.setParams({
            parentId: id,
            fileName: 'poster',
            base64Data: file,
            contentType: file.type
        });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let results = response.getReturnValue();
                console.log('attt id :' + results);
                component.set("v.message", "Image uploaded");
                console.log('ended reading');
            } else {

                component.set("v.message", "Image upoad failes");
            }
        });
        component.set("v.message", "Uploading...");
        $A.enqueueAction(action);
    }

})