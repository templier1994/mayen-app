<template>
    <div>
        <b-navbar toggleable="lg" type="light" id="navbar" >
                <b-navbar-brand>
                    <div >
                        <img class="" src="https://swisstacticaldevelopment.ch/storage/std-adapted.png" height="50em" >

                    </div>

                </b-navbar-brand>
<!--                <b-navbar-toggle target="nav-collapse" tabs align="center"></b-navbar-toggle>   -->
                <b-collapse id="nav-collapse" is-nav >
                    <b-navbar-nav class="ml-auto" >
                        <b-nav-item href="/#/">CARTE</b-nav-item>

                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">NEIGE</template>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'neige', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                        </b-nav-item-dropdown>

                        <b-nav-item-dropdown>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">TEMPÉRATURE</template>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v2', sectorName: 'Télécabine' } }">Télécabine</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pralan'  } }">Pralan</b-dropdown-item>
                            <b-dropdown-item :to="{ name: 'temperature', params: {sensorName: 'measure-v0', sectorName: 'Pro de Savioz'  } }">Pro de Savioz</b-dropdown-item>
                        </b-nav-item-dropdown>

                        <!-- Test new button Contact with creation of a new page-->
                        <b-nav-item href="/#/contact">CONTACT</b-nav-item>

                    </b-navbar-nav>
                    <!-- Right aligned nav items -->
<!--                    <b-navbar-nav class="">     -->
<!--                        <b-nav-item-dropdown>   -->
                            <!-- Using 'button-content' slot -->
<!--                            <template slot="button-content" >USER</template>        -->
<!--                                 <b-form-checkbox v-model="checked" @change="checkedChanged" class="text-left ml-3"> Snow </b-form-checkbox> -->
<!--                            <b-dropdown-item class="text-left ml-3">Login</b-dropdown-item> -->
<!--                        </b-nav-item-dropdown> -->
<!--                    </b-navbar-nav>             -->
                </b-collapse>
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
        font-family: Roboto;
    }
</style>
