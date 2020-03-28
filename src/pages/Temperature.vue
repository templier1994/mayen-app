<template>
    <div class="level">
        <h3 style="font-weight: bold">{{sectorName}}</h3>
        <b-container class="bv-example-row bv-example-row-flex-cols">
        <b-row class="m-4" align-h="center">
            <b-col cols="4">
                <b-card
                        border-variant="secondary"
                        header= "Température actuelle"
                        header-border-variant="secondary"
                        align="center"
                        class=""
                >
                    <b-card-text v-if="lastBatteryValue > 0" class="h1"  style="color: #2c3e50">{{lastBatteryValue}} °C</b-card-text>
                    <b-card-text v-if="lastBatteryValue <= 0" class="h1"  style="color: red">{{lastBatteryValue}} °C</b-card-text>


                </b-card>
            </b-col>
        </b-row>
        </b-container>


        <StockChart :data="series_battery"/>
    </div>

</template>

<script>
    import Influx from 'influx'
    import moment from 'moment'
    import NProgress from 'nprogress'
    import StockChart from '../components/StockChart.vue'
    import credInflux from "../constants/influx";

    var newPath;
    var oldPath;
    const ALERTTEMPERATURE = 3;                                // min value for the alert temperature to small
    const AUTOREALOADTIME = 300000; //300000                               // autoreload time constant 5 minutes



    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });


    export default {
        props : [
            'sectorName'
        ],
        name: 'level',
        components: {
            //chart: Chart,
            StockChart,
        },

        mounted () {
            newPath = this.sectorName
            console.log(newPath)
            NProgress.start();


            // switch to know which data i have to load : cuisine, douche or exterieur
            switch(newPath.toString().toLowerCase()){
                case "cuisine":
                    this.loadTemperatureCuisineData();
                    break;
                case "douche":
                    this.loadTemperatureDoucheData();
                    break;
                case "extérieur":
                    this.loadTemperatureExterieurData();
                    break;

                default:
                    break;

            }
            oldPath=newPath                                     // save the path in oldPath, used in function reloadPage
            console.log("oldpath: " + oldPath);

        },


        beforeUpdate() {
            this.reloadPage()                                   // function to reload the page
        },

        updated(){
 //           this.alertTemperature();                            // pop up an alert for the temperature
        },

        created() {
            this.autoReload()                                  // autoreload the page with timer
        },

        beforeDestroy() {
            clearInterval(this.timerReload)                     // VERY IMPORTANT to delete the timer
        },

        methods : {
            /**
             * reload de page with timer to have allways the last value displayed
             */
            autoReload : function(){
                this.timerReload = setInterval(() => {
                    console.log("timer temperature !!!!!!!!!!!!!!!!!!!!!!!!!!")
                    location.reload()

                    // test to call the graphical reload here

                }, AUTOREALOADTIME)
            },

            /**
             * reload de page when the user switch the room
             */
            reloadPage : function(){
                newPath = this.sectorName
                if(newPath !== oldPath){
                    console.log("path as changed")
                    location.reload()
                }
            },

//---------- query data for the cuisine
            /**
             * get data from influx for the room cuisine
             */
            loadTemperatureCuisineData: function() {
                 Promise.all([
                        client.query('SELECT * FROM temperature_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                    ]).then(parsedRes => {
                        const mutatedArray = parsedRes.map( arr => {
                            this.lastBatteryValue = arr[arr.length-1]['temperature'];

                            return Object.assign({}, {
                                name: "temperature",
                                turboThreshold:60000,
                                data: arr.map( obj => Object.assign({}, {
                                    x: (moment(obj.time).unix())*1000,
                                    y: obj['temperature']
                                }))
                            });
                        });
                        this.series_battery = mutatedArray;
                     NProgress.done();
                    }).catch(error => console.log(error))
            },
//----------query data for the douche
            /**
             * get data from influx for the room douche
             */
            loadTemperatureDoucheData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['temperature'];
                        return Object.assign({}, {
                            name: "temperature",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['temperature']
                            }))
                        });
                    });
                    this.series_battery = mutatedArray;
                    NProgress.done()
                }).catch(error => console.log(error))

            },
//---------------query data for the exterieur
            /**
             * get data from influx for the room exterieur
             */
            loadTemperatureExterieurData: function() {
                Promise.all([
                    client.query('SELECT * FROM temperature_exterieur WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['temperature'];
                        return Object.assign({}, {
                            name: "temperature",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['temperature']
                            }))
                        });
                    });
                    this.series_battery = mutatedArray;
                    NProgress.done()
                }).catch(error => console.log(error))

            },
//----------------------------------------------------------------------------------------------------------------------

            alertTemperature: function () {
                if (this.lastBatteryValue < ALERTTEMPERATURE) {
                    alert("ATTENTION température actuelle : " + this.lastBatteryValue + "°C dans la " + this.sectorName )

                }
            }
        },

        data () {
            return {

                timerReload : null, //this is for the autoreaload

                series_level : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                series_battery : [{
                    name: "",
                    turboThreshold:60000,
                    data: [],

                }],
                lastLevelValue:"",
                lastBatteryValue:""
            }

        }

    }
</script>

<style scoped>

</style>
