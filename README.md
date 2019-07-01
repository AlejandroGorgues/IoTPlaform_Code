# IoTPlaform_Code

This is a repository that contains all three code and files to make each platform works

## Installation

In order to execute each component, you need to follow the installation that [bleno](https://github.com/noble/bleno) and [noble](https://github.com/noble/noble) is written on the README as well as nodejs for npm on Raspbian and the js library that will create the graph [jKstra](https://github.com/bbecquet/jKstra) that will be used only for the BluetoothNodoGuiado platform.

```bash
sudo apt-get install -y nodejs
npm install jkstra
```

## Usage

For the usage we will be using in order to make it clear, one terminal for each process

### GuidingNode

```bash
sudo BLENO_HCI_DEVICE_ID=0 node gatt-peripheral-module-mobile.js
sudo NOBLE_HCI_DEVICE_ID=1 node gatt-central-module-parking-lot.js
```

### ParkingLot

```bash
sudo BLENO_HCI_DEVICE_ID=0 node gatt-pheripheral-module-parkingLot.js 
sudo BLENO_HCI_DEVICE_ID=1 node beaconAdvertising.js 
python Advisor.py
python ParkingLotSensor.py
```

### ParkingLotNoSensor

```bash
sudo bleno beaconAdvertising.js 
```