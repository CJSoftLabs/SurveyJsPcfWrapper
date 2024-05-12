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
import { SurveyJsFormPcfComponent, SurveyJsFormPcfProps } from "./SurveyJsFormPcfComponent";

export class SurveyJsForm implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private notifyOutputChanged: () => void;
    private container: HTMLDivElement;
    private SurveyModelData: string;
    private ReadOnly: boolean;
    private ReturnNoData: boolean;
    private ThemeName: string;
    private SurveyData: string;
    private rootControl: Root;
    private oParam: SurveyJsFormPcfProps;
    private Completed: boolean;
    private SaveAsPdf: boolean;
    private ExternalFiles: any;

    onJsonValueChanged = (strJson: string, bCompleted: boolean): {} => {
        this.SurveyData = strJson;
        this.Completed = bCompleted;

        if(!this.ReturnNoData)
        {
            this.notifyOutputChanged();
        }

        return {}; 
    };

    /**
     * Empty constructor.
     */
    constructor()
    {
        this.SurveyData = "{}";
        this.SurveyModelData = "{}";

        this.oParam = {
            SurveyModelData: JSON.parse("{}"),
            SurveyData: JSON.parse("{}"),
            //SurveyPdfModelData: JSON.parse("{}"),
            ThemeName: "Default",
            ReadOnly: false,
            EnableSaveAsPdf: false,
            onValueChanged: this.onJsonValueChanged
        };
    }

    initializeExternalScripts() {
        if (typeof window.ClassicEditor === 'undefined') {
            var script_CkEditor = document.getElementById('script_CkEditor');
            if (!script_CkEditor) {
                // CKEditor script is not loaded, load it dynamically
                var script = document.createElement('script');
                script.id = "script_CkEditor";
                script.type = 'text/javascript';
                script.async = false;
                script.src = this.ExternalFiles.ckeditorjs || "";//'https://cdn.ckeditor.com/ckeditor5/41.2.1/classic/ckeditor.js'; // Replace with the actual path to CKEditor script
                script.onload = this.initializeCKEditor; // Initialize CKEditor after script is loaded
                document.head.appendChild(script); // Append the script element to the document
            }
        }
        
        if (typeof window.Quill === 'undefined') {
            var css_QuillEditor = document.getElementById('css_QuillEditor');
            if (!css_QuillEditor) {
                // QuillEditor script is not loaded, load it dynamically
                var css = document.createElement('link');
                css.id = "css_QuillEditor";
                //css.type = 'text/javascript';
                css.rel = "stylesheet";
                css.href = this.ExternalFiles.quillcss || "";//'https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.snow.css'; // Replace with the actual path to QuillEditor script
                document.head.appendChild(css); // Append the script element to the document
            }

            var script_QuillEditor = document.getElementById('script_QuillEditor');
            if (!script_QuillEditor) {
                // QuillEditor script is not loaded, load it dynamically
                var script1 = document.createElement('script');
                script1.id = "script_QuillEditor";
                script1.type = 'text/javascript';
                script1.async = false;
                script1.src = this.ExternalFiles.quilljs || "";//'https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.js'; // Replace with the actual path to QuillEditor script
                script1.onload = this.initializeQuillEditor; // Initialize CKEditor after script is loaded
                document.head.appendChild(script1); // Append the script element to the document
            }
        }
    }

    initializeCKEditor() {
        // Check if ClassicEditor is available
        if (typeof window.ClassicEditor !== 'undefined') {
            // Now you can use ClassicEditor
            console.log("CKEditor loaded successfully!");
        } else {
            console.error("CKEditor failed to load!");
        }
    }

    initializeQuillEditor() {
        // Check if QuillEditor is available
        if (typeof window.ClassicEditor !== 'undefined') {
            // Now you can use QuillEditor
            console.log("QuillEditor loaded successfully!");
        } else {
            console.error("QuillEditor failed to load!");
        }
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
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";
        this.ExternalFiles = JSON.parse(context.parameters.ExternalFiles.raw || "{}");
        this.initializeExternalScripts();

        this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
        this.SurveyData = context.parameters.SurveyData.raw || "{}";
        this.ReturnNoData = this.ToBoolean(context.parameters.ReturnNoData.raw || "");
        //this.Completed = this.ToBoolean((context.parameters.Completed.raw || "No")); //Set the default value as 'No' for TwoOption field
        this.SaveAsPdf = this.ToBoolean(context.parameters.SaveAsPdf.raw || "false");
    
        // Parse JSON and render controls
        this.RenderControls();
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this.ReadOnly = this.ToBoolean(context.parameters.ReadOnly.raw || "");
        this.ThemeName = context.parameters.ThemeName.raw || "Default";

        this.SurveyModelData = context.parameters.SurveyModelData.raw || "{}";
        this.SurveyData = context.parameters.SurveyData.raw || "{}";
        this.ReturnNoData = this.ToBoolean(context.parameters.ReturnNoData.raw || "");
        //this.Completed = context.parameters.Completed.raw || "No"; //Set the default value as 'No' for TwoOption field
        //this.Completed = this.ToBoolean((context.parameters.Completed.raw || "No")); //Set the default value as 'No' for TwoOption field
        this.SaveAsPdf = this.ToBoolean(context.parameters.SaveAsPdf.raw || "false");
    
        // Parse JSON and render controls
        this.RenderControls();
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

    private RenderControls(): void {
        try {
            this.oParam.SurveyModelData = JSON.parse(this.SurveyModelData);
        } catch (error) {
            console.log("Error parsing JSON (SurveyModelData):", error);
            this.oParam.SurveyModelData = "{}";
        }
        try {
            this.oParam.SurveyData = JSON.parse(this.SurveyData);
        } catch (error) {
            console.log("Error parsing JSON (SurveyData):", error);
            this.oParam.SurveyData = "{}";
        }
        this.oParam.ReadOnly = this.ReadOnly;
        this.oParam.ThemeName = this.ThemeName;
        this.oParam.EnableSaveAsPdf = this.SaveAsPdf;

        if(this.rootControl === undefined)
        {
            this.rootControl = createRoot(this.container);
        }
        this.rootControl.render(React.createElement(
            SurveyJsFormPcfComponent,
            this.oParam
        ));
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return { SurveyData: this.SurveyData, Completed: this.Completed } as IOutputs;
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
