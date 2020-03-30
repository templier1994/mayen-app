<template>
    <div class="statistic">
        <h2 style="font-weight: bold">Statistiques annuelles</h2>
        <br>
        <h3>Temperature</h3>
        <img class="" src="../assets/temperature.jpg" height="100em" >
        <b-row class="m-4">
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Minimum cuisine"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if="temperatureMinCuisine > 0" class="h1"  style="color: #2c3e50">{{temperatureMinCuisine}} °C</b-card-text>
                    <b-card-text v-if="temperatureMinCuisine <= 0" class="h1"  style="color: red">{{temperatureMinCuisine}} °C</b-card-text>

                    <b-card-text class="h3" >{{dayMinTempCuisine}}</b-card-text>

                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Maximum cuisine"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if="temperatureMaxCuisine > 0" class="h1"  style="color: #2c3e50">{{temperatureMaxCuisine}} °C</b-card-text>
                    <b-card-text v-if="temperatureMaxCuisine <= 0" class="h1"  style="color: red">{{temperatureMaxCuisine}} °C</b-card-text>

                    <b-card-text class="h3">{{dayMaxTempCuisine}}</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header=" Minimum douche"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if="temperatureMinDouche > 0" class="h1"  style="color: #2c3e50">{{temperatureMinDouche}} °C</b-card-text>
                    <b-card-text v-if="temperatureMinDouche <= 0" class="h1"  style="color: red">{{temperatureMinDouche}} °C</b-card-text>


                    <b-card-text class="h3">{{dayMinTempDouche}}</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Maximum douche"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text v-if="temperatureMaxDouche > 0" class="h1"  style="color: #2c3e50">{{temperatureMaxDouche}} °C</b-card-text>
                    <b-card-text v-if="temperatureMaxDouche <= 0" class="h1"  style="color: red">{{temperatureMaxDouche}} °C</b-card-text>


                    <b-card-text class="h3">{{dayMaxTempDouche}}</b-card-text>
                </b-card>
            </b-col>
        </b-row>


        <br>
        <h3>Humidité</h3>
        <img class="" src="../assets/humidity.png" height="100em" >

        <b-row class="m-4">
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Minimum cuisine"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{humidityMinCuisine}} %</b-card-text>
                    <b-card-text class="h3">{{dayMinHumCuisine}}</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Maximum cuisine"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{humidityMaxCuisine}} %</b-card-text>
                    <b-card-text class="h3">{{dayMaxHumCuisine}}</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Minimum douche"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{humidityMinDouche}} %</b-card-text>
                    <b-card-text class="h3">{{dayMinHumDouche}}</b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card
                        border-variant="secondary"
                        header="Maximum douche"
                        header-border-variant="secondary"
                        align="center"
                >
                    <b-card-text class="h1">{{humidityMaxDouche}} %</b-card-text>
                    <b-card-text class="h3">{{dayMaxHumDouche}}</b-card-text>
                </b-card>
            </b-col>

        </b-row>

    </div>

</template>

<script>

    import Influx from 'influx'
    import NProgress from 'nprogress'
    import credInflux from "../constants/influx";

    const client = new Influx.InfluxDB({
        database: credInflux.database,
        host: credInflux.host,
        port: credInflux.port,
        protocol: credInflux.protocol,
        username: credInflux.username,
        password: credInflux.password
    });

    export default {
        name: "Statistic",

        // load all data before the page mounted
        beforeMount() {
            this.loadTemperatureMinCuisine()
            this.loadTemperatureMaxCuisine()
            this.loadTemperatureMinDouche()
            this.loadTemperatureMaxDouche()
            this.loadHumidityMinCuisine()
            this.loadHumidityMaxCuisine()
            this.loadHumidityMinDouche()
            this.loadHumidityMaxDouche()

        },

        methods:{
            /**
             * get into database the minimum temperature on last year in the cuisine
             */
            loadTemperatureMinCuisine: function() {
                Promise.all([
                    client.query('SELECT MIN(temperature) FROM temperature_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.temperatureMinCuisine = arr[arr.length-1]['min'];
                        this.dayMinTempCuisine= this.convertDay(arr[arr.length-1]['time']);


                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the maximum temperature on last year in the cuisine
             */
            loadTemperatureMaxCuisine: function() {
                Promise.all([
                    client.query('SELECT MAX(temperature) FROM temperature_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.temperatureMaxCuisine = arr[arr.length-1]['max'];
                        this.dayMaxTempCuisine= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the minimum temperature on last year in the douche
             */
            loadTemperatureMinDouche: function() {
                Promise.all([
                    client.query('SELECT MIN(temperature) FROM temperature_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.temperatureMinDouche = arr[arr.length-1]['min'];
                        this.dayMinTempDouche= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the maximum temperature on last year in the douche
             */
            loadTemperatureMaxDouche: function() {
                Promise.all([
                    client.query('SELECT MAX(temperature) FROM temperature_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.temperatureMaxDouche = arr[arr.length-1]['max'];
                        this.dayMaxTempDouche= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * get into database the minimum humidity on last year in the cuisine
             */
            loadHumidityMinCuisine: function() {
                Promise.all([
                    client.query('SELECT MIN(humidity) FROM humidity_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.humidityMinCuisine = arr[arr.length-1]['min'];
                        this.dayMinHumCuisine= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the maximum humidity on last year in the cuisine
             */
            loadHumidityMaxCuisine: function() {
                Promise.all([
                    client.query('SELECT MAX(humidity) FROM humidity_cuisine WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.humidityMaxCuisine = arr[arr.length-1]['max'];
                        this.dayMaxHumCuisine= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the minimum humidity on last year in the douche
             */
            loadHumidityMinDouche: function() {
                Promise.all([
                    client.query('SELECT MIN(humidity) FROM humidity_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.humidityMinDouche = arr[arr.length-1]['min'];
                        this.dayMinHumDouche= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },
            /**
             * get into database the maximum humidity on last year in the douche
             */
            loadHumidityMaxDouche: function() {
                Promise.all([
                    client.query('SELECT MAX(humidity) FROM humidity_douche WHERE time>now()-365d' ), // WHERE time>now()-365d
                ]).then(parsedRes => {
                    parsedRes.map( arr => {
                        this.humidityMaxDouche = arr[arr.length-1]['max'];
                        this.dayMaxHumDouche= this.convertDay(arr[arr.length-1]['time']);
                    });
                    NProgress.done();
                }).catch(error => console.log(error))
            },

            /**
             * convert time to right format
             * @param time
             * @returns {string}
             */
            convertDay:function (time) {
                var res = time.toString().split(" ");
                return res[0] +" " + res[2] +" " +res[1] + " " +res[3] + " " +res[4];
            }


        },


        /*
         * this is all the variable used at same time for the logic and for the HTML page
         */
        data(){
            return{
                temperatureMinCuisine : 0,
                dayMinTempCuisine : 0,

                temperatureMaxCuisine : 0,
                dayMaxTempCuisine : 0,

                temperatureMinDouche : 0,
                dayMinTempDouche : 0,

                temperatureMaxDouche : 0,
                dayMaxTempDouche : 0,

                humidityMinCuisine : 0,
                dayMinHumCuisine : 0,

                humidityMaxCuisine : 0,
                dayMaxHumCuisine : 0,

                humidityMinDouche : 0,
                dayMinHumDouche : 0,

                humidityMaxDouche : 0,
                dayMaxHumDouche : 0,


            }
        }
    }


</script>

<style scoped>

</style>