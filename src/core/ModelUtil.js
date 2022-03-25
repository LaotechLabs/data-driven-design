import lang from '../dojo/_base/lang'
import CoreUtil from './CoreUtil'

class ModelUtil {

    constructor() {
        this.designTokenCssProps = [
            'color',
            'fontSize',
            'fontWeight',
            'fontFamily',
            'textAlign',
            'letterSpacing',
            'lineHeight',
            'background',
            'boxShadow',
            'paddingTop',
            'paddingBottom',
            'paddingLeft',
            'paddingRight',
            'borderTopWidth',
            'borderRightWidth',
            'borderLeftWidth',
            'borderBottomWidth',
            'borderTopColor',
            'borderBottomColor',
            'borderRightColor',
            'borderLeftColor'
        ].map(t => 'dt-' + t)
    }

    isLogicWidget(widget) {
        return widget && (widget.type === 'LogicOr' || widget.type === "Rest")
    }

    inlineModelDesignTokens(model) {
        /**
         * This is quite costly. Can we do this smarter? Maybe we could do it in the
         * RenderFactory (beawre of hover etc). Then we would have to just add here
         * for all the reference design token the modified?
         */
        if (model.designtokens) {
            for (let widgetID in model.widgets) {
                let widget = model.widgets[widgetID]
                this.inlineBoxDesignToken(widget, model)
            }
            for (let screenId in model.screens) {
                let scrn = model.screens[screenId]
                this.inlineBoxDesignToken(scrn, model)
            }
            /**
             * FIXME Add tempaltes
             */
        }
        return model
    }

    inlineBoxDesignToken(box, model) {
        /**
         * If the box is templates, we copy all the designtokens from the template
         */
        if (box && box.template && model.templates && model.templates[box.template]) {
            let template = model.templates[box.template]
            if (template.designtokens) {
                /**
                 * We could mix this in....
                 */
                box.designtokens = template.designtokens
            }
        }
        if (box && box.designtokens) {
            let designtokens = box.designtokens
            for (let state in designtokens) {
                if (!box[state]) {
                    box[state] = {}
                }
                let stateTokens = designtokens[state]
                for (let cssProp in stateTokens) {
                    let designTokenId = stateTokens[cssProp]
                    let designToken = model.designtokens[designTokenId]
                    if (designToken) {
                        if (designToken.isComplex) {
                            box[state][cssProp] = designToken.value[cssProp]
                        } else {
                            box[state][cssProp] = designToken.value
                        }
                    } else {
                        console.warn('ModelUtil.inlineBoxDesignToken() > NO token with id or no value:' + designTokenId, designToken)
                    }
                }
            }
        }
        return box
    }


    inlineTemplateModifies(model) {
        /**
         * We set the template modfied date, so in RenderFlow we can recognize that we have to update the widget.
         */
        if (model.templates) {
            for (let widgetID in model.widgets) {
                let widget = model.widgets[widgetID]
                if (widget.template) {
                    let t = model.templates[widget.template];
                    if (t) {
                        widget._templateModified = t.modified
                    }
                }
            }
        }
        return model
    }

    inlineTemplateStyles(model) {
        for (let widgetID in model.widgets) {
            let widget = model.widgets[widgetID]
            if (widget.template) {

                let hover = this.getTemplatedStyle(widget, model, 'hover')
                if (hover) {
                    widget.hover = hover
                }
                let error = this.getTemplatedStyle(widget, model, 'error')
                if (error) {
                    widget.error = error
                }
                let focus = this.getTemplatedStyle(widget, model, 'focus')
                if (focus) {
                    widget.focus = focus
                }
                let active = this.getTemplatedStyle(widget, model, 'active')
                if (active) {
                    widget.active = active
                }
            }

        }
        return model
    }

    getTemplatedStyle(widget, model, prop = 'style') {
        if (widget.template) {
            if (model.templates) {
                const template = model.templates[widget.template];
                if (template && template[prop]) {
                    /**
                     * Merge in overwriten styles
                     */
                    const merged = lang.clone(template[prop])
                    if (widget[prop]) {
                        let props = widget[prop]
                        for (var key in props) {
                            merged[key] = props[key]
                        }
                    }
                    return merged;
                }
            }
        }
        return widget[prop];
    }

    createScalledModel(model, zoom) {

        const zoomedModel = lang.clone(model);
        zoomedModel.isZoomed = true;

        this.getZoomedBox(zoomedModel.screenSize, zoom, zoom);

        for (let id in zoomedModel.widgets) {
            this.getZoomedBox(zoomedModel.widgets[id], zoom, zoom);
        }

        for (let id in zoomedModel.screens) {
            var zoomedScreen = this.getZoomedBox(
                zoomedModel.screens[id],
                zoom,
                zoom
            );

            /**
             * This has a tiny tiny bug that makes copy of the same screen jump as x and y and rounded()
             * To fix this, we should take the relative and x and y in the parent and round that...
             *
             * scalledWidget.x = scalledScreen.x + (orgWidget.x - orgScreen.x)*zoomX
             *
             * As an alternative we could stop using Math.round() ...
             */
            for (let i = 0; i < zoomedScreen.children.length; i++) {
                let wid = zoomedScreen.children[i];
                let zoomWidget = zoomedModel.widgets[wid];
                let orgWidget = model.widgets[wid];
                if (orgWidget) {
                    /**
                     * When we copy a screen we might not have the org widget yet
                     */
                    var orgScreen = model.screens[zoomedScreen.id];
                    var difX = this.getZoomed(orgWidget.x - orgScreen.x, zoom);
                    var difY = this.getZoomed(orgWidget.y - orgScreen.y, zoom);
                    if (orgWidget.parentWidget) {
                        if (zoomWidget.x >= 0) {
                            zoomWidget.x = zoomedScreen.x + difX;
                        }
                        if (zoomWidget.y >= 0) {
                            zoomWidget.y = zoomedScreen.y + difY;
                        }
                    } else {
                        zoomWidget.x = zoomedScreen.x + difX;
                        zoomWidget.y = zoomedScreen.y + difY;
                    }
                }
            }
        }

        for (let id in zoomedModel.lines) {
            let line = zoomedModel.lines[id];
            for (let i = 0; i < line.points.length; i++) {
                this.getZoomedBox(line.points[i], zoom, zoom);
            }
        }


        return zoomedModel;
    }

    getZoomedBox(box, zoomX, zoomY) {
        return CoreUtil.getZoomedBox(box, zoomX, zoomY, false);
    }

    getZoomed(v, zoom) {
        return CoreUtil.getZoomed(v, zoom, false);
    }

    updateInheritedRefs(model) {
        for (let screenId in model.screens) {
            let screen = model.screens[screenId]
            /**  
             * We need to update master refs only for screens
             * that have a master
             */
            if (screen.parents && screen.parents.length > 0) {
                this.updateErrorLabelsInScreen(screen, model)
            }

        }
        return model
    }

    updateErrorLabelsInScreen(screen, model) {
        screen.children.forEach(id => {
            let widget = model.widgets[id]
            /**
             * Inherited input widgets might have errorLabels attached. These will
             * point to the ids in the master screen and need to be updated.
             */
            if (widget.inherited) {
                if (widget.props && widget.props.refs) {
                    let errorLabels = widget.props.refs.errorLabels
                    if (errorLabels) {
                        /**
                         * Update all error labels by adding the current screen id
                         */
                        let inheritedErrorLabels = errorLabels.map(l => l + '@' + screen.id)
                        widget.props.refs.errorLabels = inheritedErrorLabels
                    }
                }
            }
        })
    }

    setMergedTemplateStyle(widget, template, mode) {
        if (template[mode]) {
            if (!widget[mode]) {
                widget[mode] = {}
            }
            let style = template[mode]
            for (let key in style) {
                if (widget[mode][key] === undefined) {
                    widget[mode][key] = style[key]
                }
            }
        }
    }

    updateTemplateStyle(widget, template, mode) {
        if (widget[mode]) {
			const style = widget[mode]
			if (!template[mode]) {
				template[mode] = {}
			}
			for (let key in style) {
				const value = style[key]
				template[mode][key] = value
			}
			widget[mode] = {};
		}
    }

    setStylesNotInTemplate(widget, template, mode) {
        if (widget[mode]) {
            let result = {}
            if (widget[mode] && template[mode]) {
                let widgetStyle = widget[mode]
                let templateStyle = template[mode]
                for (let key in widgetStyle) {
                    if (templateStyle[key] !== widgetStyle[key]) {
                        result[key] = widgetStyle[key]
                    }
                }
            }
            widget[mode] = result
        }
	}

    getViewModeStyle (widget, model, widgetViewMode) {
     
        // we get the default style. This method
		// will take the template and mix in 
		// the nornal "style" overwrites
		const normal = this.getTemplatedStyle(widget, model, 'style');

		if (widget[widgetViewMode]){
			const mixed = lang.clone(normal);

            // if we have specific overwrite in the template
            // for the given widgetViewMode, we mix this in and
            // overwrite the values
            if (widget.template && model.templates[widget.template]) {
                const template = model.templates[widget.template]
                if (template && template[widgetViewMode]) {
                    const templateStyle = template[widgetViewMode]
                    for (let key in templateStyle) {
                        mixed[key] = templateStyle[key];
                    }
                }
            }
            // last we mix in values that are defined 
            // in the widget
            const widgetStyle = widget[widgetViewMode];
            for (let key in widgetStyle){
                mixed[key] = widgetStyle[key];
            }
            return mixed;
		}
		return normal;
    }

    getCanvasWidgets (model) {
        const result = []
        const widgetsOnScreens = {}
        Object.values(model.screens).forEach(s => {
            s.children.forEach(id => {
                widgetsOnScreens[id] = true
            })
        })
        Object.values(model.widgets).forEach(w => {
            if (!widgetsOnScreens[w.id]) {
                result.push(w)
            }
        })
        return result
    }


    getWidgetsTyTemplate(templateId, model) {
        let result = []
        for (let widgetID in model.widgets) {
            let widget = model.widgets[widgetID]
            if (widget.template === templateId) {
                result.push(widget)
            }
        }
        return result
    }

}

export default new ModelUtil()