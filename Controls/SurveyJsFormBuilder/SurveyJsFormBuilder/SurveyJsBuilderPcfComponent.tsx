import React from "react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react/survey-creator-react";


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
        //this.creator.text = window.localStorage.getItem("survey-json") || JSON.stringify(this.state.SurveyBuilderData);
        //this.creator.text = JSON.stringify(this.props.SurveyBuilderData) || "{}";

        this.creator.saveSurveyFunc = () => { 
          this.props.onValueChanged(this.creator.text);
          console.log(this.props.SurveyBuilderData);
        };
    }

    render() {
      this.creator.text = JSON.stringify(this.props.SurveyBuilderData) || "{}";
      console.log("Child component rendered.");
        return (
          <SurveyCreatorComponent creator={this.creator} />
        );
    }
}