<template>
    <div class="info" id="contact">
        <b-jumbotron>
            <template v-slot:header>Home monitoring</template>

            <template v-slot:lead>
                <br>
                <p>Le projet de monitoring de chalets</p>
                <a href="https://swisstacticaldevelopment.ch/" target="_blank">
                    <img class="ml-3" src="https://swisstacticaldevelopment.ch/storage/std-adapted.png" height="100em" >
                </a>

                <br><br>



                <p> Swiss Tactical Development </p>
                <p> Rue de la chapelle 27</p>
                <p> 1958 Uvrier</p>
                <br>
                <p> +41 (0)79 716 79 84</p>
                <p> amos.jerome@swisstacticaldevelopment.ch </p>

                <br><br>

            </template>

            <hr class="my-4">
  <!--          <b-carousel
                    id="carousel-fade"
                    style="text-shadow: 0 0 2px #000"
                    fade
                    indicators
                    class="w-75 m-auto"
            >

                <b-carousel-slide img-src="https://www.anzere.ch/data/images/accroches/Rando/170730_ot_anzere_bisse_ayent_420.jpg">
                    <h3> source : ayent.ch</h3>
                </b-carousel-slide>
                <b-carousel-slide img-src="https://www.ayent.ch/data/images/galeries/villages/La-Place.jpg">
                    <h3> source : ayent.ch</h3>
                </b-carousel-slide>
                <b-carousel-slide img-src="https://www.anzere.ch/data/images/accroches/Rando/171019_ot_anzere_rawyl_025_m.jpg" >
                    <h3> source : anzere.ch</h3>
                </b-carousel-slide>

            </b-carousel> -->
        </b-jumbotron>
    </div>
</template>

<script>
    export default {
        name: "Contact",
        components: {},
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
    #contact {
        font-family: Roboto;
    }

</style>
