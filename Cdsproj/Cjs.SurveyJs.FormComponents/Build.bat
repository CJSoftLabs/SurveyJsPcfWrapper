cd ..\..\Controls\SurveyJsForm
MSBUILD /t:restore
MSBUILD /P:Config=Release
cd ..\SurveyJsFormBuilder
MSBUILD /t:restore
MSBUILD /P:Config=Release
::cd ..\SurveyJsFormCollection
::MSBUILD /t:restore
::MSBUILD /P:Config=Release
cd ..\..\Cdsproj\Cjs.SurveyJs.FormComponents
MSBUILD /t:restore
MSBUILD /P:Config=Release
