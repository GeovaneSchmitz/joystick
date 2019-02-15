#!/usr/bin/python

from pynput.keyboard import Key, Controller
import time
import os
import json
from threading import Thread

import sys


import socket
import json
pid = os.fork()

server_address = sys.argv[1]
key = []

keyboard = Controller()



sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
sock.connect(server_address)
while True:
    data = sock.recv(128)
    msg = data.decode('UTF-8')
    if(len(msg) != 22):
        msg = msg.replace("}{", "}!{")
        listmsg = msg.split("!")
        for index in range(len(listmsg)):
            if(len(listmsg[index]) == 22):
                key = json.loads(listmsg[index])
                if key["type"]=="p":
                    keyboard.press(key["key"])
                elif key["type"]=="r":
                    keyboard.release(key["key"])
    else:
        key = json.loads(msg)
        if key["type"]=="p":
            keyboard.press(key["key"])
        elif key["type"]=="r":
            keyboard.release(key["key"])
sock.close()


