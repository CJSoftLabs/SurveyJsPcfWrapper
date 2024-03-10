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
import React = require("react");
import { createRoot, Root } from 'react-dom/client';
import { SurveyJsFormPcfComponent, SurveyJsFormPcfProps } from "./SurveyJsPcfComponent";

export class SurveyJsForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private notifyOutputChanged: () => void;
    private container: HTMLDivElement;
    private SurveyModelData: string;
    private SurveyRecordId: string;
    private SurveyData: string;
    private rootControl: Root;
    private oParam: SurveyJsFormPcfProps;

    onJsonValueChanged = (strJson: string): {} => {
        this.SurveyData = strJson;
        console.log("onJsonValueChanged triggered");
        // console.log(this.jsonInput);
        this.notifyOutputChanged();

        return {}; 
    };

    /**
     * Empty constructor.
     */
    constructor()
    {
        this.oParam = {
            SurveyModelData: JSON.parse("{}"),
            SurveyRecordId: "",
            SurveyData: JSON.parse("{}"),
            ReadOnly: false,
            onValueChanged: this.onJsonValueChanged
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
        console.log(context);

        // Add control initialization code
        this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
        this.SurveyRecordId = (context.mode as any).contextInfo.entityId;
        this.SurveyData = context.parameters.SurveyData.raw || "{}";

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
        this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
        this.SurveyData = context.parameters.SurveyData.raw || "{}";
        console.log("UpdateView triggered");
        console.log(this.SurveyData);
        
        // Parse JSON and render controls
        this.renderControls();
    }

    private renderControls(): void {
        console.log("Render Control triggered.");
        try {
            this.oParam.SurveyModelData = JSON.parse(this.SurveyModelData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            this.oParam.SurveyModelData = "{}";
        }
        try {
            this.oParam.SurveyData = JSON.parse(this.SurveyData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            this.oParam.SurveyData = "{}";
        }
        this.oParam.SurveyRecordId = this.SurveyRecordId;

        if(this.rootControl === undefined)
        {
            this.rootControl = createRoot(this.container);
        }
        this.rootControl.render(React.createElement(
            SurveyJsFormPcfComponent,
            this.oParam
        ));
        //this.rootControl.render(childComponent);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return { SurveyData: this.SurveyData } as IOutputs;
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
