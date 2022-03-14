/* global TW */
TW.IDE.Widgets.pythoneditor = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/PythonEditorWidget/ui/pythoneditor/pythoneditor.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'PythonEditor',
      'description': 'Widget to show a Python editor',
      'category': ['Common'],
      'iconImage': 'pythoneditor.png',
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
          description: "the Python code",
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
    return '<div class="widget-content widget-pythoneditor">' + '<span class="pythoneditor-property">Python Editor</span>' + '</div>';
  };
};