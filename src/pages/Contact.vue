<template>
    <div class="info">
        <b-jumbotron>
            <template v-slot:header>MayenMon</template>

            <template v-slot:lead>
                <p>Le projet de monitoring de la température d'un mayen </p>
                <a href="https://swisstacticaldevelopment.ch/" target="_blank">
                    <img class="ml-3" src="https://swisstacticaldevelopment.ch/storage/std-adapted.png" height="150em" >
                </a>


                <br><br><br>

                <p style="font-weight: bold"> Swiss Tactical Development </p>
                <p> Rue de la chapelle 27</p>
                <p> 1958 Uvrier CH</p>
                <br>
                <p> +41 (0)79 716 79 84</p>
                <p> amos.jerome@swisstacticaldevelopment.ch </p>

                <br><br>

            </template>

            <hr class="my-4">
            <b-carousel
                    id="carousel-fade"
                    style="text-shadow: 0 0 2px #000"
                    fade
                    indicators
                    class="w-75 m-auto"
            >
                <b-carousel-slide img-src="https://www.anzere.ch/data/images/accroches/Rando/170730_ot_anzere_bisse_ayent_420.jpg" />
                <b-carousel-slide img-src="https://i.ytimg.com/vi/QJUn4BME06Y/maxresdefault.jpg" />
                <b-carousel-slide img-src="https://www.valais.ch/media/cache/single_image/a/activity-suonen_ayent_anzere_1.jpg" />
            </b-carousel>
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

</style>
