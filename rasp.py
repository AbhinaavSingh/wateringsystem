
import time
import sys
import json
import RPi.GPIO as gpio
from azure.servicebus import ServiceBusService

gpio.setmode(gpio.BOARD)
channel_list=[11,12,13,15,16,18,22,29,31,33]
gpio.setup(channel_list,gpio.IN)

key_name = "SendRule"
key_value = "YEsTSbHUumqNJfnAr2O6Si0h/DIlblKpvJl3HJHFhiU="

sbs = ServiceBusService("smartwatering-ns",shared_access_key_name=key_name,shared_access_key_value=key_value)

event={}
event['device_id']=1
event['value']=0

while (True):
    j='0'
    j=j+str(gpio.input(11))
    j=j+str(gpio.input(12))
    j=j+str(gpio.input(13))
    j=j+str(gpio.input(15))
    j=j+str(gpio.input(16))
    j=j+str(gpio.input(18))
    j=j+str(gpio.input(22))
    j=j+str(gpio.input(29))
    j=j+str(gpio.input(31))
    j=j+str(gpio.input(33))
    value=int(j,2)
    print(value)
    event['value']=value
    sbs.send_event('smartwatering',json.dump(event))
