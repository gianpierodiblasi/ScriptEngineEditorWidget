/* global TW, require, URL, monaco */

TW.Runtime.Widgets.pythoneditor = function () {
  var parametersEditor, pythonEditor;
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());

  this.runtimeProperties = function () {
    return {
      'needsDataLoadingAndError': false,
      'supportsAutoResize': true
    };
  };

  this.renderHtml = function () {
    var html = '';
    html =
            '<div class="widget-content widget-pythoneditor widget-pythoneditor widget-pythoneditor-' + uid + '">' +
            '  <label class="widget-pythoneditor-label">Parameters</label>' +
            '  <textarea class="widget-pythoneditor-ParametersTextArea widget-pythoneditor-ParametersTextArea_' + uid + '"></textarea>' +
            '  <div id="widget-pythoneditor-ParametersMonaco_' + uid + '" class="widget-pythoneditor-ParametersMonaco"></div>' +
            //
            '  <label class="widget-pythoneditor-label widget-pythoneditor-top10">Result Parameter</label>' +
            '  <input type="text" class="widget-pythoneditor-ResultParameter widget-pythoneditor-ResultParameter_' + uid + '"/>' +
            //
            '  <label class="widget-pythoneditor-label widget-pythoneditor-top10">Code</label>' +
            '  <textarea class="widget-pythoneditor-PythonTextArea widget-pythoneditor-PythonTextArea_' + uid + '"></textarea>' +
            '  <div id="widget-pythoneditor-PythonMonaco_' + uid + '" class="widget-pythoneditor-PythonMonaco"></div>' +
            //
            '  <div class="widget-pythoneditor-top10" style="text-align:right">' +
            '	   <div class="widget-pythoneditor-run widget-pythoneditor-run_' + uid + '">Run</div>' +
            '  </div>' +
            //
            '  <label class="widget-pythoneditor-label widget-pythoneditor-top10">Result</label>' +
            '  <input type="text" class="widget-pythoneditor-Result widget-pythoneditor-Result_' + uid + '" readonly/>' +
            '</div>';
    return html;
  };

  this.afterRender = function () {
    try {
      if (window.monaco && monaco.editor) {
        createEditors();
      } else {
        require.config({paths: {'vs': 'https://unpkg.com/monaco-editor@latest/min/vs'}});
        window.MonacoEnvironment = {getWorkerUrl: () => proxy};
        var proxy = URL.createObjectURL(new Blob([`
          self.MonacoEnvironment = {baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'};
          importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
        `], {type: 'text/javascript'}));
        require(["vs/editor/editor.main"], createEditors);
      }
    } catch (exception) {
      parametersEditor = null;
      pythonEditor = null;
      $("#widget-pythoneditor-ParametersMonaco_" + uid).css("display", "none");
      $("#widget-pythoneditor-PythonMonaco_" + uid).css("display", "none");
      $(".widget-pythoneditor-ParametersTextArea_" + uid).css("display", "block");
      $(".widget-pythoneditor-PythonTextArea_" + uid).css("display", "block");
      thisWidget.addEvents();
      thisWidget.updateEditor();
    }
  };

  function createEditors() {
    try {
      parametersEditor = monaco.editor.create(document.getElementById('widget-pythoneditor-ParametersMonaco_' + uid), {
        value: "",
        language: 'json',
        scrollBeyondLastLine: false,
        theme: 'vs',
        minimap: {
          enabled: false
        }
      });

      pythonEditor = monaco.editor.create(document.getElementById('widget-pythoneditor-PythonMonaco_' + uid), {
        value: "",
        language: 'python',
        scrollBeyondLastLine: false,
        theme: 'vs',
        minimap: {
          enabled: false
        }
      });
    } catch (exception) {
      parametersEditor = null;
      pythonEditor = null;
      $("#widget-pythoneditor-ParametersMonaco_" + uid).css("display", "none");
      $("#widget-pythoneditor-PythonMonaco_" + uid).css("display", "none");
      $(".widget-pythoneditor-ParametersTextArea_" + uid).css("display", "block");
      $(".widget-pythoneditor-PythonTextArea_" + uid).css("display", "block");
    }

    thisWidget.addEvents();
    thisWidget.updateEditor();
  }

  this.serviceInvoked = function (serviceName) {
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === 'debugMode') {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
    } else if (updatePropertyInfo.TargetProperty === 'parameters') {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
      this.updateEditor();
    } else if (updatePropertyInfo.TargetProperty === 'resultParameter') {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
      this.updateEditor();
    } else if (updatePropertyInfo.TargetProperty === 'code') {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
      this.updateEditor();
    }
  };

  this.addEvents = function () {
    if (parametersEditor) {
      parametersEditor.getModel().onDidChangeContent(() => {
        try {
          thisWidget.setProperty("parameters", JSON.parse(parametersEditor.getModel().getValue()));
        } catch (exception) {
        }
      });
    } else {
      document.getElementsByClassName("widget-pythoneditor-ParametersTextArea_" + uid)[0].oninput = () => {
        try {
          thisWidget.setProperty("parameters", JSON.parse(event.srcElement.value));
        } catch (exception) {
        }
      };
      document.getElementsByClassName("widget-pythoneditor-ParametersTextArea_" + uid)[0].onchange = () => {
        try {
          thisWidget.setProperty("parameters", JSON.parse(event.srcElement.value));
        } catch (exception) {
        }
      };
    }

    document.getElementsByClassName("widget-pythoneditor-ResultParameter_" + uid)[0].oninput = () => thisWidget.setProperty("resultParameter", event.srcElement.value);
    document.getElementsByClassName("widget-pythoneditor-ResultParameter_" + uid)[0].onchange = () => thisWidget.setProperty("resultParameter", event.srcElement.value);

    if (pythonEditor) {
      pythonEditor.getModel().onDidChangeContent(() => thisWidget.setProperty("code", pythonEditor.getModel().getValue()));
    } else {
      document.getElementsByClassName("widget-pythoneditor-PythonTextArea_" + uid)[0].oninput = () => thisWidget.setProperty("code", event.srcElement.value);
      document.getElementsByClassName("widget-pythoneditor-PythonTextArea_" + uid)[0].onchange = () => thisWidget.setProperty("code", event.srcElement.value);
    }

    document.getElementsByClassName("widget-pythoneditor-run_" + uid)[0].onclick = () => {
      if (!$(".widget-pythoneditor-run_" + uid).hasClass("widget-pythoneditor-run-disabled")) {
        thisWidget.setEnabled(false);

        var success = function (invoker) {
          document.getElementsByClassName("widget-pythoneditor-Result_" + uid)[0].value = JSON.stringify(invoker.result.rows[0].result.value);
          thisWidget.setEnabled(true);
        };

        var fail = function (invoker, xhr) {
          document.getElementsByClassName("widget-pythoneditor-Result_" + uid)[0].value = xhr.responseText;
          thisWidget.setEnabled(true);
        };

        var invoker = new ThingworxInvoker({
          entityType: 'Resources',
          entityName: 'PythonResource',
          characteristic: 'Services',
          target: 'exec',
          apiMethod: 'POST'
        });

        invoker.setParameterValue("parameters", thisWidget.getProperty("parameters"));
        invoker.setParameterValue("resultParameter", thisWidget.getProperty("resultParameter"));
        invoker.setParameterValue("code", thisWidget.getProperty("code"));
        invoker.invokeService(success, fail);
      }
    };
  };

  this.updateEditor = function () {
    var parameters = thisWidget.getProperty("parameters");
    var resultParameter = thisWidget.getProperty("resultParameter");
    var code = thisWidget.getProperty("code");

    if (parametersEditor) {
      parametersEditor.getModel().setValue(parameters);
    } else {
      document.getElementsByClassName("widget-pythoneditor-ParametersTextArea_" + uid)[0].value = parameters;
    }

    document.getElementsByClassName("widget-pythoneditor-ResultParameter_" + uid)[0].value = resultParameter;

    if (pythonEditor) {
      pythonEditor.getModel().setValue(code);
    } else {
      document.getElementsByClassName("widget-pythoneditor-PythonTextArea_" + uid)[0].value = code;
    }
  };

  this.setEnabled = function (enabled) {
    if (parametersEditor) {
      parametersEditor.updateOptions({readOnly: !enabled});
    } else {
      document.getElementsByClassName("widget-pythoneditor-ParametersTextArea_" + uid)[0].disabled = enabled ? "" : "disabled";
    }

    document.getElementsByClassName("widget-pythoneditor-ResultParameter_" + uid)[0].disabled = enabled ? "" : "disabled";

    if (pythonEditor) {
      pythonEditor.updateOptions({readOnly: !enabled});
    } else {
      document.getElementsByClassName("widget-pythoneditor-PythonTextArea_" + uid)[0].disabled = enabled ? "" : "disabled";
    }

    if (enabled) {
      $(".widget-pythoneditor-run_" + uid).removeClass("widget-pythoneditor-run-disabled");
    } else {
      $(".widget-pythoneditor-run_" + uid).addClass("widget-pythoneditor-run-disabled");
    }
  };

  this.beforeDestroy = function () {
    try {
      console.log("Python Editor -> destroy editors");
      TW.log.info("Python Editor -> destroy editors");
      if (parametersEditor) {
        parametersEditor.getModel().dispose();
        parametersEditor.dispose();
        parametersEditor = null;
      }
      if (pythonEditor) {
        pythonEditor.getModel().dispose();
        pythonEditor.dispose();
        pythonEditor = null;
      }
    } catch (err) {
      TW.log.error('Python Editor Before Destroy Error', err);
    }
  };
};