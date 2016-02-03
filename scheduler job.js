var CONNECTION_STRING = "Driver={SQL Server Native Client 10.0};Server=tcp:dpyemfy7yo.database.windows.net,1433;Database=dbo.avgvalues;Uid=smartwatering;Pwd=123MSP!!!;Encrypt=yes;Connection Timeout=30;";
var QUERY = "SELECT * FROM avgvalues WHERE DATEDIFF (MINUTE, timeofcompletion, SYSDATETIME()) <= 1;";

var pushTable = tables.getTable('push_ready');
var channelTable = tables.getTable('channel');

function fetchPush() {
    mssql.query('SELECT * FROM avgvalues WHERE DATEDIFF (MONTH, timeofcompletion, SYSDATETIME()) <= 1', {
        success: function (results) {
            var pushes = [];
            var channelValues;
            channelTable.read({
                success: function (values) {
                        channelValues = values;
                        results.forEach(function (result) {
                            for (var i = 0; i < channelValues.length; i++) {
                                if (result.device_id == channelValues[i].device_id) {
                                    pushes.push({
                                        device_id: result.device_id,
                                        channel_uri: channelValues[i].channel_uri
                                    });
                                }
                            }
                        });
                        var InsertIntoPush = function (object, done) {
                            pushTable.insert(object, {
                                success: function () {
                                    done();
                                }
                            });
                        }
                        var count = pushes.length;
                        var insertAction = function (index) {
                            if (index >= count) {
                                return;
                            }
                            InsertIntoPush (pushes[index], function () {
                                insertAction(index + 1);
                            });
                        }
                        insertAction(0);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}