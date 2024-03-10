import React from "react";
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

export interface SurveyJsFormPcfProps {
    SurveyModelData: string;
    SurveyRecordId: string;
    SurveyData: string;
    onValueChanged: (strJson: string) => {};
    ReadOnly: boolean;
}

export class SurveyJsFormPcfComponent extends React.Component<SurveyJsFormPcfProps> {
    SurveyModel: Model;
    SurveyData: string;
    SurveyRecordId: string;
    constructor(props: SurveyJsFormPcfProps) {
        super(props);
        console.log("SurveyJsFormPcfProps: constructor called.");
        this.SurveyRecordId = this.props.SurveyRecordId;
        this.SurveyData = this.props.SurveyData;
        this.SurveyModel = new Model(this.props.SurveyModelData);
        this.SurveyModel.data = this.SurveyData;

        console.log(this.SurveyRecordId);

        if(this.props.ReadOnly) {
            this.SurveyModel.mode = "display";
        }

        this.SurveyModel.onComplete.add((sender) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });

        this.SurveyModel.onValueChanged.add((sender) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });

        this.SurveyModel.onCurrentPageChanged.add((sender: any) => {
            this.SurveyData = sender.data;
            this.props.onValueChanged(JSON.stringify(this.SurveyData));
        });
    }

    render() {
      console.log("Child component rendered.");
      return <Survey model={this.SurveyModel} />;
    }
}