<template>
    <div class="CreatePagePreview" ref="CreatePageRef">
    </div>
</template>

<script>
    import Two from "two.js";
    let twoObj;
    export default {
        name: 'CreatePagePreview',
        methods: {
            init() {
                let params = {
                    fitted: true
                }
                let elem = this.$refs.CreatePageRef;
                let two = new Two(params).appendTo(elem);
                let rect = two.makeRectangle(two.width * 0.5, two.height * 0.5, 375 * 0.27, 812 * 0.27);
                rect.fill = 'rgb(255,255,255)';
                rect.opacity = 0.75;
                rect.noStroke();
                two.update();
                twoObj = two;
            },
            changeSize(height, width) {
                twoObj.scene.children[0].height = height;
                twoObj.scene.children[0].width = width;
                twoObj.update();
            }
        },
        async mounted() {
            this.init();
        }
    }
</script>