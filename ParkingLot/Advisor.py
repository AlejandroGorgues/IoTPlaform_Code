#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time

ledPin = 11    # RPI Board pin11

def setup():
	GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
	GPIO.setup(ledPin, GPIO.OUT)   # Set ledPin's mode is output
	GPIO.output(ledPin, GPIO.LOW) # Set ledPin low to off led
	print ('using pin%d'%ledPin)
	
def activate():
	f=open("ledAction.txt", "r")
	if f.mode == 'r':
		contents =f.read()
		if contents == "light":
			return True
		else:
			return False

def loop():
	GPIO.output(ledPin, GPIO.HIGH)  # led on
	
	
def down():
	GPIO.output(ledPin, GPIO.LOW)  # led off
	


def destroy():
	GPIO.output(ledPin, GPIO.LOW)     # led off
	GPIO.cleanup()                     # Release resource

if __name__ == '__main__':     # Program start from here
	setup()
	while True:
		if activate():
			try:
				loop()
			except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
				destroy()
		else:
			try:
				down()
			except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
				destroy()
