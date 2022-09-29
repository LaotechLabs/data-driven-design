
<template>
  <div class="HorizontalWidget ">
  </div>
</template>
<style>
.HorizontalWidget {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: left;
}
</style>
  
<script>
import DojoWidget from "dojo/DojoWidget";
import lang from "dojo/_base/lang";
import on from "dojo/on";
import touch from "dojo/touch";
import UIWidget from "core/widgets/UIWidget";

export default {
  name: "Label",
  mixins: [UIWidget, DojoWidget],
  data: function () {
    return {
      value: "",
      style: {},
      model: {}
    };
  },
  components: {},
  computed: {
    options() {
      return this.style.options
    }
  },
  methods: {

    getName() {
      return 'Horizontal'
    },

    postCreate() {
      this._borderNodes = [this.domNode];
      this._backgroundNodes = [this.domNode];
      this._shadowNodes = [this.domNode];
      this._paddingNodes = [this.domNode];
      this._labelNodes = [this.domNode];
    },

    getCreateTemplates() {
      return [
        {
          "id": "Horizontal",
          "type": "Horizontal", // must be the same as tghe name used in the SymbolService
          "_type": "Widget",
          "category": "WireFrame",
          "subcategory": "AAAAAA",
          "name": "Horizontal",
          "x": 0,
          "y": 0,
          "w": 3000,
          "h": 4,
          "z": 0,
          "has": {
            "onclick": true,
            "data": true,
            "label": true
          },
          "style": {
            "background": "black",
            "padding": "5px",
            "opacity": "0.5"
          }
        }
      ]
    },

    wireEvents() {
      this.own(this.addClickListener(this.domNode, lang.hitch(this, 'onClick')));
      this.own(on(this.domNode, touch.over, lang.hitch(this, 'onDomMouseOver')));
      this.own(on(this.domNode, touch.out, lang.hitch(this, 'onDomMouseOut')));
    },

    getLabelNode() {
      return this.$refs.lblNode;
    },

    render(model, style, scaleX, scaleY) {
      this.model = model;
      this.style = style;
      this._scaleX = scaleX;
      this._scaleY = scaleY;

      this.setStyle(style, model);
      if (model.props && model.props.label) {
        this.setValue(model.props.label);
      }
    },

    getValue() {
      return this.value;
    },

    setValue(value) {
      this.value = value;
    },

    getState() {
      return {
        type: 'value',
        value: this.value
      };
    },

    setState(state) {
      /**
       * Hack for the time when we use the getValueLabel() mechnism!
       */
      if (this.hackValueLabel) {
        return;
      }
      if (state && state.type == 'value') {
        this.setValue(state.value);
      }
    },

    resize() {
    },

    onClick: function (e) {
      this.stopEvent(e);
      this.emitClick(e);
    }
  }
};
</script>