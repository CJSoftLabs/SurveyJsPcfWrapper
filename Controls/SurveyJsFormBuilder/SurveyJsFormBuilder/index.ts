/*
MIT License

Copyright (c) 2024 CJSoftLabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import React from "react";
import { createRoot, Root } from 'react-dom/client';
import { SurveyJsBuilderPcfProps, SurveyJsBuilderPcfComponent } from "./SurveyJsBuilderPcfComponent";

export class SurveyJsFormBuilder implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private container: HTMLDivElement;
    private jsonInput: string;
    private autoSave: boolean;
    private rootControl: Root;
    private oParam: SurveyJsBuilderPcfProps;

    onJsonValueChanged = (strJson: string): {} => {
        this.jsonInput = strJson;
        this.notifyOutputChanged();

        return {}; 
    };
    /**
     * Empty constructor.
     */
    constructor()
    {
        this.oParam = {
            SurveyBuilderData: JSON.parse("{}"),
            onValueChanged: this.onJsonValueChanged,
            creatorOptions: {}
        };
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        // Add control initialization code
        this.jsonInput = context.parameters.JsonInput.raw || "{}";
        this.autoSave = this.ToBoolean(context.parameters.AutoSave.raw || "");

        // Parse JSON and render controls
        this.renderControls();
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this.jsonInput = context.parameters.JsonInput.raw || "{}";
        this.autoSave = this.ToBoolean(context.parameters.AutoSave.raw || "");
        
        // Parse JSON and render controls
        this.renderControls();
    }

    private ToBoolean(strInput: string): boolean {
        let bReturn = false;
        switch(strInput.toLowerCase().trim()) {
            case "1":
            case "true":
            case "yes":
                bReturn = true;
                break;
        }

        return bReturn;
    }

    private renderControls(): void {
        console.log("Render Control triggered.");
        try {
            this.oParam.SurveyBuilderData = JSON.parse(this.jsonInput);
            this.oParam.creatorOptions = {
                showLogicTab: true,
                showThemeTab: true,
                isAutoSave: this.autoSave
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            this.oParam.SurveyBuilderData = {};
            //return;
        }

        if(this.rootControl === undefined)
        {
            this.rootControl = createRoot(this.container);
        }
        this.rootControl.render(React.createElement(
            SurveyJsBuilderPcfComponent,
            this.oParam
        ));
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return { JsonInput: this.jsonInput } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
