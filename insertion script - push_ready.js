function insert(item, user, request) {
    request.execute({
        success: function() {
            push.wns.sendToastText04(item.channel_uri, {
                text1: 'Watered Enough! Please stop watering.'
                },
                {
                    success: function(pushResponse) {
                        console.log("Sent push:", pushResponse);
                        request.respond();
                    },              
                    error: function (pushResponse) {
                        console.log("Error Sending push:", pushResponse);
                        request.respond(500, { error: pushResponse });
                    }
                });
            }
        });
}