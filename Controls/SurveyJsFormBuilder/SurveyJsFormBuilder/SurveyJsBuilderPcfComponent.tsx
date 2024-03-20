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

import React from "react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react/survey-creator-react";
import { RegisterQuillRteToolboxItem, RegisterQuillRteComponent } from './QuillRteComponent';
import { RegisterCkEditorRteToolboxItem, RegisterCkEditorRteComponent } from './CkEditorRteComponent';

RegisterQuillRteToolboxItem();
RegisterQuillRteComponent();
RegisterCkEditorRteToolboxItem();
RegisterCkEditorRteComponent();

export interface SurveyJsBuilderPcfProps {
    SurveyBuilderData: any;
    onValueChanged: (strJson: string) => {};
    creatorOptions: {};
}

export class SurveyJsBuilderPcfComponent extends React.Component<SurveyJsBuilderPcfProps> {
    creator: SurveyCreator;
    constructor(props: SurveyJsBuilderPcfProps) {
        super(props);
        console.log("SurveyJsBuilderPcfComponent: constructor called.");

        this.creator = new SurveyCreator(this.props.creatorOptions);

        // Add the Quill question type to the Toolbox
        const toolboxItems = this.creator.toolbox.items;
        const quillIndex = toolboxItems.findIndex((item) => item.name === "quill-rte");

        if(quillIndex > -1)
        {
          const quillItem = toolboxItems.splice(quillIndex, 1)[0];
          quillItem.tooltip = "Quill - Rich Text Editor";
          quillItem.title = "Quill - Rich Text Editor";
          quillItem.iconName = "icon-quill-rte";
          toolboxItems.unshift(quillItem);
        }

        // Add the CkEditor question type to the Toolbox
        const ckeditorIndex = toolboxItems.findIndex((item) => item.name === "ckeditor-rte");

        if(ckeditorIndex > -1)
        {
          const ckeditorItem = toolboxItems.splice(ckeditorIndex, 1)[0];
          ckeditorItem.tooltip = "CkEditor - Rich Text Editor";
          ckeditorItem.title = "CkEditor - Rich Text Editor";
          ckeditorItem.iconName = "icon-ckeditor-rte";
          toolboxItems.unshift(ckeditorItem);
        }

        this.creator.toolbox.defineCategories([
          {
            category: "Choice-Based Questions",
            items: [
              "dropdown",
              "checkbox",
              "radiogroup",
              "tagbox",
              "rating",
              "boolean"
            ]
          },
          {
            category: "Text Input Questions",
            items: [
              "text",
              // Override the display title
              { name: "comment", title: "Multi-Line Input" },
              "ckeditor-rte",
              "multipletext",
              "quill-rte"
            ]
          },
          {
            category: "Read-Only Elements",
            items: [
              { name: "expression", title: "Expression" }
            ]
          },
          {
            category: "Matrices",
            items: [
              "matrix",
              "matrixdropdown",
              "matrixdynamic"
            ]
          },
          {
            category: "Panels",
            items: [
              "panel",
              "paneldynamic"
            ]
          }
        ], false);
        
        this.creator.toolbox.allowExpandMultipleCategories = true;
        this.creator.toolbox.showCategoryTitles = true;
        this.creator.toolbox.forceCompact = false;
    
        // Apply HTML markup to survey contents
        /*this.creator.survey.onTextMarkdown.add(this.applyHtml);
        this.creator.onSurveyInstanceCreated.add((options) => {
            console.log(options);
            if (options.activeTab === "designer" || options.activeTab === "test") {
                options.survey.onTextMarkdown.add(this.applyHtml);
            }
        });*/

        this.creator.saveSurveyFunc = () => { 
          this.props.onValueChanged(this.creator.text);
          console.log(this.props.SurveyBuilderData);
        };
    }

    /*applyHtml(options: any) {
      let str = options.text;
      if(!(str === undefined || str === "undefined" || str === null))
      {
        if (str.indexOf("<p>") === 0) {
            // Remove root paragraphs <p></p>
            str = str.substring(3);
            str = str.substring(0, str.length - 4);
        }
        // Set HTML markup to render
        options.html = str;
      }
    }*/

    render() {
      this.creator.text = JSON.stringify(this.props.SurveyBuilderData) || "{}";
      console.log("Child component rendered.");
        return (
          <SurveyCreatorComponent creator={this.creator} />
        );
    }
}