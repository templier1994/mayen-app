<template>
    <div class="level">
        <h3 style="font-weight: bold">{{sectorName}}</h3>
        <b-container class="bv-example-row bv-example-row-flex-cols">
            <b-row class="m-4" align-h="center">
                <b-col cols="4">
                    <b-card
                            border-variant="secondary"
                            header="Humidité actuelle"
                            header-border-variant="secondary"
                            align="center"
                            class=""
                    >
                        <b-card-text class="h1">{{lastBatteryValue}} %</b-card-text>
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
    const AUTOREALOADTIME = 20000;   //300000                        // autoreload time constant


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
                    this.loadHumidityCuisineData();
                    break;
                case "douche":
                    this.loadHumidityDoucheData();
                    break;
                case "extérieur":
                    this.loadHumidityExterieurData();
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

        created() {
            this.autoReload()                                  // autoreload the page with timer
        },

        beforeDestroy() {
            clearInterval(this.timerReload)                     // VERY IMPORTANT to delete the timer
        },

        methods : {

            /**
             * function to refresh the graph
             */
            refresh: function(page){
                switch(page.toString().toLowerCase()){
                    case "cuisine":
                        this.loadHumidityCuisineData();
                        break;
                    case "douche":
                        this.loadHumidityDoucheData();
                        break;
                    case "extérieur":
                        this.loadHumidityExterieurData();
                        break;

                    default:
                        break;

                }
            },
            /**
             * reload de page with timer to have allways the last value displayed
             */
           autoReload : function(){
               this.timerReload = setInterval(() => {
                   console.log("timer humidity !!!!!!!!!!!!!!!!!!!!!!!!!!")
                   this.refresh(oldPath);

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
            loadHumidityCuisineData: function() {
                Promise.all([
                    client.query('SELECT * FROM humidity_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['humidity'];
                        return Object.assign({}, {
                            name: "humidity",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['humidity']
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
            loadHumidityDoucheData: function() {
                Promise.all([
                    client.query('SELECT * FROM humidity_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['humidity'];
                        return Object.assign({}, {
                            name: "humidity",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['humidity']
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
            loadHumidityExterieurData: function() {
                Promise.all([
                    client.query('SELECT * FROM humidity_exterieur WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {

                    const mutatedArray = parsedRes.map( arr => {
                        this.lastBatteryValue = arr[arr.length-1]['humidity'];
                        return Object.assign({}, {
                            name: "humidity",
                            turboThreshold:60000,
                            data: arr.map( obj => Object.assign({}, {
                                x: (moment(obj.time).unix())*1000,
                                y: obj['humidity']
                            }))
                        });
                    });
                    this.series_battery = mutatedArray;
                    NProgress.done()
                }).catch(error => console.log(error))

            }

        },

        data () {
            return {
                timerReload : null,                                     //this is for the auto reaload

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
