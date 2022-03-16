/* global TW */
TW.IDE.Widgets.scriptengineeditor = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/ScriptEngineEditorWidget/ui/scriptengineeditor/scriptengineeditor.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'ScriptEngineEditor',
      'description': 'Widget to show an editor for script code (Python, JavaScript, etc.)',
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
          description: "the ScriptEngine code",
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
    return '<div class="widget-content widget-scriptengineeditor">' + '<span class="scriptengineeditor-property">ScriptEngine Editor</span>' + '</div>';
  };
};