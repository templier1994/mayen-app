<template>
    <div>
        <b-navbar toggleable="lg" type="light" id="navbar">
                <b-navbar-brand>
                    <div>
                        <img class="" src="https://swisstacticaldevelopment.ch/storage/std-adapted.png" height="100em" >
                    </div>
                    <div>

                    </div>
                </b-navbar-brand>
            <b-container>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item href="/#/">CARTE</b-nav-item>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">HUMIDITE</template>
                            <b-dropdown-item :to="{ name: 'humidity', params: {sensorName: 'measure-v2', sectorName: 'Cuisine' } }">Cuisine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'humidity', params: {sensorName: 'measure-v0', sectorName: 'Douche'  } }">Douche</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'humidity', params: {sensorName: 'measure-v0', sectorName: 'Extérieur'  } }">Extérieur</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">TEMPÉRATURE</template>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Cuisine' } }">Cuisine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Douche'  } }">Douche</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Extérieur'  } }">Extérieur</b-dropdown-item>
                        </b-nav-item-dropdown>

                        <!---New button for the statistics page-->
                        <b-nav-item href="/#/statistic">STATISTIQUES</b-nav-item>
                        <!-- Test new button Contact with creation of a new page-->
                        <b-nav-item href="/#/contact">CONTACT</b-nav-item>

                    </b-navbar-nav>
                    <!-- Right aligned nav items -->

                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>
<script>
    /** import {serverBus} from "../main";*/

    export default {
        data() {
            return {
                checked:false,
            }

        },

        methods: {
            checkedChanged (){
                this.checked = !this.checked;
                /** serverBus.$emit('activeSnow', this.checked);*/
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #navbar {
        background-color: #B8B8B8;
    }
</style>
