<template>
    <div class="home">

        <b-container fluid class="mh-100">
            <b-row>
                <transition name="slide">
                <b-col>
                    <l-map
                            style="height: 880px;width: 100%"
                            :zoom="zoom"
                            :center="center"
                            @update:zoom="zoomUpdated"
                            @update:center="centerUpdated"
                            @update:bounds="boundsUpdated"
                            @click="printPosition"
                            class="leaflet-control-layers-list"

                    >

                        <l-control-layers ref="control"
                                          :sort-layers="true"
                        />

                        <l-tile-layer :url="url" name="Satellite" layer-type="base" />                         <!--change url by url2 and it display first satellite -->
                        <l-tile-layer :url="url2" name="carte" layer-type="base" />                            <!--change url2 by url and it display first carte -->

                        <l-layer-group
                                layer-type="overlay"
                                name="Capteurs"
                                :visible="true"

                                >
                            <l-marker v-for="(sensor,index) in sensors" :lat-lng="sensor.position" :key="index + 10"
                                      @click="loadData(sensor.id)" :icon="sensor.icon" :visible="true">
                                <l-popup>
                                    <div v-if="sensor.type===1">
                                        <h4>{{sensor.position_name}}</h4>
                                        <div>Hauteur de neige : {{sensor.pressure}} mm</div>
                                        <div>Température au sol : {{sensor.debit}} °C</div>
                                        <div>Température au capteur : {{sensor.debit}} °C</div>


                                    </div>
                                    <div v-if="sensor.type===2">
                                        <h4>{{sensor.position_name}}</h4>
                                        <div>Température du sol : {{sensor.temp}} °C</div>
                                    </div>
                                </l-popup>
                            </l-marker>
                        </l-layer-group>

                        <l-layer-group
                                layer-type="overlay"
                                name="Antennes "
                                :visible="true">

                            <!-- in downAntennas -->
                            <l-marker  v-for="(antenna,index) in antennas" :lat-lng="antenna.position" :key="index + 100"
                                      @click="lastSeenAntenna(antenna.eui, antenna.id)" :icon="antenna.icon"
                                      :visible="true">

                                <l-popup v-if="antenna.isUp == true">

                                        <h5>{{antenna.position_name}}</h5>
                                        <div>latitude: {{antenna.position[0]}}</div>
                                        <div>longitude: {{antenna.position[1]}}</div>
                                        <div>Vu il y a : {{antenna.lastSeen}} secondes</div>

                                </l-popup>
                                <l-popup v-else>
                                        <h5>{{antenna.position_name}}</h5>
                                        <div>latitude: {{antenna.position[0]}}</div>
                                        <div>longitude: {{antenna.position[1]}}</div>
                                        <div> DOWN depuis {{antenna.timestamp}}</div>

                                </l-popup>
                            </l-marker>
                        </l-layer-group>


                    </l-map>
                </b-col>
                </transition>

                <!--Button Status--> <!-- delete layer group to see the button-->

 <!--               <b-button   squared variant="null" @click="toggleStatus" style="height: fit-content; align-self: center"><img :src="arrow" /></b-button>
                <transition name="slide">

                    <b-col v-if="showStatus" cols="3" class="align-self-center">
                    <b-card>
                        <div class="lucida">
                            <h1>Status antennes</h1>
                            <pre>Prochain test dans {{seconds}} secondes...</pre>
                            <div class="">
                                <div v-for="(antenna, index) in antennas" :key="index+200">
                                          <div v-if="antenna.isUp">
                                        <p class="text-left">> {{antenna.position_name}}</p>
                                        <pre class="text-left">     <span style="color: green">OK</span> </pre>
                                    </div>
                                    <div v-else>
                                        <p class="text-left">
                                            > Status {{antenna.position_name}}
                                        </p>
                                        <pre class="text-left">     <span style="color: red">DOWN</span> depuis {{antenna.timestamp}}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-col>
               </transition> -->

            </b-row>
        </b-container>
    </div>

</template>


<script>
    import {LMap, LTileLayer, LMarker, LPopup, LControlLayers, LLayerGroup} from 'vue2-leaflet'
    import Influx from 'influx'
    import {Icon} from 'leaflet'
    import L from 'leaflet'
    import axios from 'axios'
    import credInflux from '../constants/influx'



    delete Icon.Default.prototype._getIconUrl;
    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });
    Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });


    export default {
        name: 'home',
        components: {
            LMap, LTileLayer, LMarker, LPopup, LControlLayers, LLayerGroup,

        },
        data() {
            return {
                arrow: require('../assets/svg/left_arrow.svg'),
                showStatus:false,                                                                                       //right button to show antenna status
                timer: null,
                timerIsRunning: false,
                seconds: 30,
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                url2: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 13,
                center: [46.26664685678397, 7.401180267333985],
                bounds: null,
                markers: [
                    [46.096715752047594, 7.214045226573945],
                    [46.093561170654304, 7.212307155132295],
                ],

                sensors: [{
                    type: 1,
                    id: 1,
                    position_name: 'Télécabine',
                    pressure: "-",
                    debit: "-",
                    level: "-",
                    position: [46.29411, 7.39557],
                    icon: this.deviceIcon()
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'Pralan',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.29894, 7.40549],
                    icon: this.deviceIcon()
                }, {
                    type: 2,
                    id: 3,
                    position_name: 'Pro de Savioz',
                    pressure: "-",
                    debit: "-",
                    level: "none",
                    position: [46.26721, 7.39827],
                    icon: this.deviceIcon()
                }],
                antennas: [{
                    type: 1,
                    id: 1,
                    position_name: 'Privée',
                    position: [46.27141, 7.39897],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c22',// need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 2,
                    position_name: 'École de Botyre',
                    position: [46.27731, 7.40595],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe0f0c7b', // need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 3,
                    position_name: 'Office du tourisme',
                    position: [46.29733, 7.40000],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe106166', // need to change into the real eui
                    lastSeen: "-",
                    timeStamp: "",
                    isUp: false,
                }, {
                    type: 1,
                    id: 5,
                    position_name: 'HEVs',
                    position: [46.24046242, 7.35863492],
                    icon: this.antennaIconDown(),
                    eui: 'eui-fcc23dfffe110106',
                    lastSeen: "-",
                    timestamp: "",
                    isUp: false,
                }],
                response: "",
                downAntennas:[],
            }
        },
        created() {
            this.checkAntenna();
    //        this.activeGateways();
            this.startTimer();
            this.checkDevice();

        },
        mounted() {


        },
        //VERY VERY important !! Destroy the timer when the user change the page
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            checkDevice(){
            //     var appID = "altis-irrigation-app";
            //     var accessKey = "ttn-account-v2.YdStTLbI0FKK9DfIFVo8fYKQdw23ct_WGeVZHWp2F3w";
            //     console.log("Program running");
            //
            //     ttn.data(appID, accessKey).then(function (client) {
            //         client.devices(function (devices) {
            //             console.log("Received list of devices")
            //             console.log(devices)
            //         })
            //     })
            //         .catch(function (error) {
            //             console.error("Error", error);
            //         });
             },
            toggleStatus(){
                if (this.showStatus){
                    this.arrow = require('../assets/svg/left_arrow.svg')
                } else {
                    this.arrow = require('../assets/svg/right_arrow.svg')
                }

                this.showStatus = !this.showStatus
            },
            startTimer() {
                if (!this.timerIsRunning) {
                    this.timerIsRunning = true;
                    if (!this.timer) {
                        this.timer = setInterval(this.secondsCallback, 1000);
                    }
                }
            },
            secondsCallback() {
                if (this.seconds <= 0) {
                    this.seconds = 30;
                    this.checkAntenna();

                }
                else if (this.seconds < 31) {
                    this.seconds--;
                }

            },
            zoomUpdated(zoom) {
                this.zoom = zoom;
            },
            centerUpdated(center) {
                this.center = center;
            },
            boundsUpdated(bounds) {
                this.bounds = bounds;
            },
            loadData(id) {
                switch (id) {
                    case 1:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v0"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("DistanceComputed") FROM "level-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[0].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 2:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v4"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[1].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 3:
                        Promise.all([client.query('SELECT last("value_bar") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].pressure = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("value_m3h") FROM "measure-v2"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[2].debit = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 4:
                        Promise.all([client.query('SELECT last("Distance") FROM "level-sensor-5"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[3].level = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;
                    case 5:

                        Promise.all([client.query('SELECT last("Soil temperature") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].temp = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        Promise.all([client.query('SELECT last("Volumetric water content") FROM "field-humidity-sensor-1"'),])
                            .then(parsedRes => {
                                console.log(parsedRes);
                                this.sensors[4].humidity = parsedRes[0][0].last.toFixed(2);
                            }).catch(error => console.log(error));
                        break;

                }
            },
            printPosition(event) {
                console.log(event.latlng);
            },
            deviceIcon() {
                return L.icon({
                    iconUrl: require('../assets/gps.png'),
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-3, -76]
                })
            },
            antennaIconUp() {
                return L.icon({
                    iconUrl: require('../assets/antennaUp.png'),
                    iconSize: [64, 64],
                    iconAnchor: [32, 32],
                    popupAnchor: [32, 0]
                })
            },
            antennaIconDown() {
                return L.icon({
                    iconUrl: require('../assets/antennaDown.png'),
                    iconSize: [64, 64],
                    iconAnchor: [32, 32],
                    popupAnchor: [32, 0]
                })
            },
            lastSeenAntenna(eui, id) {
                axios('https://nodered.watermon.ch/gateway?eui=' + eui, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((response) => {
                    let now = new Date();
                    let current_datetime = new Date(response.data.timestamp);
                    let diffTime = (Math.abs(now - current_datetime) / 1000);

                    let formatedDate = Math.ceil(diffTime);
                    this.antennas[id - 1].lastSeen = formatedDate;

                }).catch((e) => {
                    console.log(e);
                });


            },
            checkAntenna() {
                console.log("Check status antennas");
                for (let i = 0; i < this.antennas.length; i++) {

                    axios('https://nodered.watermon.ch/gateway?eui=' + this.antennas[i].eui, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'origin', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then((res) => {
                        let timestamp = new Date(res.data.timestamp);
                        this.antennas[i].timestamp = timestamp
                        let now = new Date();

                        if (this.secondBetweenDate(now, timestamp) < 60) {
                            this.antennas[i].icon = this.antennaIconUp();
                            this.antennas[i].isUp = true;
                            console.log("check antenna : up")

                        } else {
                            this.antennas[i].icon = this.antennaIconDown();
                            this.antennas[i].isUp = false;
                            console.log("check antenna : down")
                            this.downGateways(i)
                        }

                    });

                }


            },
            secondBetweenDate(date1, date2) {
                return Math.ceil(Math.abs(date1 - date2) / 1000);
            },

            downGateways(i){

                console.log("activeGateways, home.vue l 436")

                        this.downAntennas[i] = this.antennas[i]
                        console.log(i)
                        console.log(this.antennas[i].isUp)

                console.log("active")
                for (let j = 0; j < this.downAntennas.length; j++) {

                    console.log(j)
                    console.log(this.downAntennas[j])
                }

            }

        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "../../node_modules/leaflet/dist/leaflet.css";



    .lucida h1 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 24px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 26.4px;
    }

    .lucida h3 {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 14px;
        font-style: normal;
        font-variant: normal;
        font-weight: 700;
        line-height: 15.4px;
    }

    .lucida p {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .lucida blockquote {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 17px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }

    .lucida pre {
        font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
        font-size: 11px;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 23px;
    }

    .console {
        background-color: #828ea0;
    }
    .example-custom-control {
        background: #fff;
        padding: 0 0.5em;
        border: 1px solid #aaa;
        border-radius: 0.1em;
    }
    .leaflet-control-layers-list {
        text-align: left;
    }
    .slide-enter-active {
        transition: all .4s ease;
    }
    .slide-leave-active {

    }
    .slide-enter, .slide-leave-to {

        transform: translateX(100vh);
        opacity: 0;
    }
</style>
