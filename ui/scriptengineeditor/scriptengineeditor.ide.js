/* global TW */
TW.IDE.Widgets.scriptengineeditor = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/ScriptEngineEditorWidget/ui/scriptengineeditor/scriptengineeditor.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'ScriptEngineEditor',
      'description': 'Widget to show an editor for scripting code (Python, JavaScript, etc.)',
      'category': ['Common'],
      'iconImage': 'scriptengineeditor.png',
      'supportsAutoResize': true,
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 200
        },
        'Height': {
          'description': 'height',
          'defaultValue': 28
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        },
        'language': {
          'isVisible': true,
          'baseType': 'STRING',
          'isEditable': true,
          'defaultValue': 'python',
          'description': 'the script language',
          'selectOptions': [
            {value: 'python', text: 'Python'},
            {value: 'javascript', text: 'JavaScript'}
          ]
        }
        ,
        'theme': {
          'isVisible': true,
          'baseType': 'STRING',
          'isEditable': true,
          'defaultValue': 'vs',
          'description': 'the theme editor',
          'selectOptions': [
            {value: 'vs', text: 'Visual Studio'},
            {value: 'vs-dark', text: 'Visual Studio Dark'},
            {value: 'hc-black', text: 'High Contrast Black'}
          ]
        },
        parameters: {
          isBindingSource: true,
          isVisible: true,
          'isEditable': true,
          isBindingTarget: true,
          description: "the parameters, represented as a JSON object containing numbers, strings, booleans and arrays of numbers, strings, booleans and arrays (recursively)",
          defaultValue: {},
          baseType: 'JSON'
        },
        resultParameter: {
          isBindingSource: true,
          isVisible: true,
          'isEditable': true,
          isBindingTarget: true,
          description: "parameter name of the result value",
          defaultValue: 'result',
          baseType: 'STRING'
        },
        code: {
          isBindingSource: true,
          isVisible: true,
          'isEditable': true,
          isBindingTarget: true,
          description: "the scripting code",
          defaultValue: '',
          baseType: 'STRING'
        }
      }
    };
  };

  this.widgetServices = function () {
    return {
    };
  };

  this.widgetEvents = function () {
    return {
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-scriptengineeditor">' + '<span class="scriptengineeditor-property">Script Engine Editor</span>' + '</div>';
  };
};