<template>
  <div class="MatcAppTypeSelector">
    <div class data-dojo-attach-point="cntr"></div>
    <div class data-dojo-attach-point="details"></div>
  </div>
</template>
<script>
import DojoWidget from "dojo/DojoWidget";
import css from "dojo/css";
import lang from "dojo/_base/lang";
import on from "dojo/on";
import touch from "dojo/touch";
import Logger from "common/Logger";
import CheckBox from "common/CheckBox";
import DomBuilder from "common/DomBuilder";
import CreatePagePreview from "page/CreatePagePreview";
// import Two from "two.js";

export default {
  name: "ScreenSizeSelector",
  mixins: [DojoWidget],
  data: function () {
    return {
      value: null,
      types: {
        "IPhone X / 11 / 12": {
          type: "smartphone",
          screenSize: { w: 375, h: 812 },
          factor: 2,
        },
        "IPhone 11 / 12 Max": {
          type: "smartphone",
          screenSize: { w: 414, h: 896 },
          factor: 2,
        },
        "IPhone 6 / 7 / 8": {
          type: "smartphone",
          screenSize: { w: 375, h: 667 },
          factor: 2,
        },
        "IPhone 6 / 7 / 8+": {
          type: "smartphone",
          screenSize: { w: 414, h: 736 },
          factor: 2,
        },
        "IPhone 5 / 6SE": {
          type: "smartphone",
          screenSize: { w: 320, h: 568 },
          factor: 2,
        },
        "Galaxy S6": {
          type: "smartphone",
          screenSize: { w: 360, h: 640 },
          factor: 3,
        },
        "IPad (Vertical)": {
          type: "tablet",
          screenSize: { w: 768, h: 1024 },
          factor: 2,
        },
        "IPad (Horizontal)": {
          type: "tablet",
          screenSize: { w: 1024, h: 768 },
          factor: 2,
        },
        "Facebook Cover": {
          type: "tablet",
          screenSize: { w: 615, h: 234 },
          factor: 2,
        },
        "Youtube Banner": {
          type: "tablet",
          screenSize: { w: 1920, h: 1080 },
          factor: 2,
        },
        "Instagram Post": {
          type: "tablet",
          screenSize: { w: 810, h: 810 },
          factor: 2,
        },
        Desktop: { type: "desktop", screenSize: { w: 1280, h: 720 } },
      },
    };
  },
  components: {},
  methods: {
    postCreate: function () {
      this.logger = new Logger("ScreenSizeSelector");
      this.logger.log(2, "postCreate", "enter >" + this.mode);

      this._divs = [];
      this._checks = [];

      var db = new DomBuilder();

      var parent = db.div().build();

      for (var id in this.types) {
        var type = this.types[id];

        var div = db.div("MatcScreenSizeItem").build(parent);
        db.span("", id).build(div);

        var size = " " + type.screenSize.w + " x " + type.screenSize.h; //+ " @" + type.factor + "x" ;
        db.div("MatcHint MatcFontSmall", size).build(div);

        // Custom Icon class
        db.div("MatcMiddleCustom").build(div);

        let c = this.$new(CheckBox);
        css.add(c.domNode, "MatcVerticalMiddle");
        c.placeAt(div);

        this.own(
          on(div, touch.press, lang.hitch(this, "onTypePress", id, type))
        );

        this._checks[id] = c;
        this._divs[id] = div;
      }

      /**
       * Custom
       */
      var custom = db.div("MatcScreenSizeItem").build(parent);
      db.span("", "Custom").build(custom);

      var inputCntr = db.div("MatcHint MatcFontSmall").build(custom);
      this.inputW = db.input("MatcIgnoreOnKeyPress").build(inputCntr);
      this.inputW.placeholder = "w";
      this.own(on(this.inputW, "keyup", lang.hitch(this, "onCustomSelected")));

      db.span("", " x ").build(inputCntr);
      this.inputH = db.input("MatcIgnoreOnKeyPress").build(inputCntr);
      this.inputH.placeholder = "h";
      this.own(on(this.inputH, "keyup", lang.hitch(this, "onCustomSelected")));

      let c = this.$new(CheckBox);
      css.add(c.domNode, "MatcVerticalMiddle");
      c.placeAt(custom);
      this.own(on(custom, touch.press, lang.hitch(this, "onCustomSelected")));

      this._checks["custom"] = c;
      this._divs["custom"] = custom;
      this.cntr.appendChild(parent);
      this.onTypePress("IPhone X / 11 / 12");
    },

    onCustomSelected: function () {
      CreatePagePreview.methods.changeSize(0, 0);
      if (this.inputH.value && this.inputW.value) {
        CreatePagePreview.methods.changeSize(
          this.inputH.value * 0.27,
          this.inputW.value * 0.27
        );
      }
      this.cleanup();
      this._checks["custom"].setValue(true);
      css.add(this._divs["custom"], "MatcScreenSizeItemSelected");
      let type = "smartphone";
      if (this.inputW.value > 1000) {
        type = "desktop";
      }
      this.value = {
        type: type,
        screenSize: {
          w: this.inputW.value * 1,
          h: this.inputH.value * 1,
        },
      };
      this._isCustom = true;
      this.$emit("change", this.getValue());
      // CreatePagePreview.methods.changeSize(obj.screenSize.h * 0.27, obj.screenSize.w * 0.27);
    },

    onTypePress: function (type, obj) {
      this.cleanup();
      this._checks[type].setValue(true);
      css.add(this._divs[type], "MatcScreenSizeItemSelected");
      this.value = this.types[type];
      this._isCustom = false;
      this.$emit("change", this.getValue());
      CreatePagePreview.methods.changeSize(
        obj.screenSize.h * 0.27,
        obj.screenSize.w * 0.27
      );
    },

    setValue: function (m) {
      var selected = null;
      for (var id in this.types) {
        var type = this.types[id];
        if (
          m.type == type.type &&
          m.screenSize.w == type.screenSize.w &&
          m.screenSize.h == type.screenSize.h &&
          selected == null
        ) {
          selected = id;
        }
      }

      if (selected) {
        this.onTypePress(selected);
      } else {
        this.inputW.value = m.screenSize.w;
        this.inputH.value = m.screenSize.h;
        this.onCustomSelected();
      }
    },

    getValue: function () {
      if (this._isCustom) {
        // Fix for Jessica
        let type = "smartphone";
        if (this.inputW.value > 1000) {
          type = "desktop";
        }
        this.value = {
          type: type,
          screenSize: {
            w: this.inputW.value * 1,
            h: this.inputH.value * 1,
          },
        };
      }
      return this.value;
    },

    cleanup: function () {
      for (var t in this._checks) {
        this._checks[t].setValue(false);
        css.remove(this._divs[t], "MatcScreenSizeItemSelected");
      }
    },
  },
  mounted() {
    // Get icon div
    let iconDivs = document.getElementsByClassName("MatcMiddleCustom");
    Array.from(iconDivs).forEach((ele) => {
      let sizing = ele.previousSibling.innerHTML;
      let sizes = sizing.split(" x ");

      // Add custom icon
      CreatePagePreview.methods.createIcon(sizes[1], sizes[0], ele);
    });
  },
};
</script>
