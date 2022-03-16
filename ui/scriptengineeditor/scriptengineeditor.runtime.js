/* global TW, require, URL, monaco */

TW.Runtime.Widgets.scriptengineeditor = function () {
  var parametersEditor, scriptengineEditor;
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
            '<div class="widget-content widget-scriptengineeditor widget-scriptengineeditor widget-scriptengineeditor-' + uid + '">' +
            '  <label class="widget-scriptengineeditor-label">Parameters</label>' +
            '  <textarea class="widget-scriptengineeditor-ParametersTextArea widget-scriptengineeditor-ParametersTextArea_' + uid + '"></textarea>' +
            '  <div id="widget-scriptengineeditor-ParametersMonaco_' + uid + '" class="widget-scriptengineeditor-ParametersMonaco"></div>' +
            //
            '  <label class="widget-scriptengineeditor-label widget-scriptengineeditor-top10">Result Parameter</label>' +
            '  <input type="text" class="widget-scriptengineeditor-ResultParameter widget-scriptengineeditor-ResultParameter_' + uid + '"/>' +
            //
            '  <label class="widget-scriptengineeditor-label widget-scriptengineeditor-top10">Code</label>' +
            '  <textarea class="widget-scriptengineeditor-ScriptEngineTextArea widget-scriptengineeditor-ScriptEngineTextArea_' + uid + '"></textarea>' +
            '  <div id="widget-scriptengineeditor-ScriptEngineMonaco_' + uid + '" class="widget-scriptengineeditor-ScriptEngineMonaco"></div>' +
            //
            '  <div class="widget-scriptengineeditor-top10" style="text-align:right">' +
            '	   <div class="widget-scriptengineeditor-run widget-scriptengineeditor-run_' + uid + '">Run</div>' +
            '  </div>' +
            //
            '  <label class="widget-scriptengineeditor-label widget-scriptengineeditor-top10">Result</label>' +
            '  <input type="text" class="widget-scriptengineeditor-Result widget-scriptengineeditor-Result_' + uid + '" readonly/>' +
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
      scriptengineEditor = null;
      $("#widget-scriptengineeditor-ParametersMonaco_" + uid).css("display", "none");
      $("#widget-scriptengineeditor-ScriptEngineMonaco_" + uid).css("display", "none");
      $(".widget-scriptengineeditor-ParametersTextArea_" + uid).css("display", "block");
      $(".widget-scriptengineeditor-ScriptEngineTextArea_" + uid).css("display", "block");
      thisWidget.addEvents();
      thisWidget.updateEditor();
    }
  };

  function createEditors() {
    var language = thisWidget.getProperty("language");

    try {
      parametersEditor = monaco.editor.create(document.getElementById('widget-scriptengineeditor-ParametersMonaco_' + uid), {
        value: "",
        language: 'json',
        scrollBeyondLastLine: false,
        theme: 'vs',
        minimap: {
          enabled: false
        }
      });

      scriptengineEditor = monaco.editor.create(document.getElementById('widget-scriptengineeditor-ScriptEngineMonaco_' + uid), {
        value: "",
        language: language,
        scrollBeyondLastLine: false,
        theme: 'vs',
        minimap: {
          enabled: false
        }
      });
    } catch (exception) {
      parametersEditor = null;
      scriptengineEditor = null;
      $("#widget-scriptengineeditor-ParametersMonaco_" + uid).css("display", "none");
      $("#widget-scriptengineeditor-ScriptEngineMonaco_" + uid).css("display", "none");
      $(".widget-scriptengineeditor-ParametersTextArea_" + uid).css("display", "block");
      $(".widget-scriptengineeditor-ScriptEngineTextArea_" + uid).css("display", "block");
    }

    thisWidget.addEvents();
    thisWidget.updateEditor();
  }

  this.serviceInvoked = function (serviceName) {
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === 'debugMode') {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
    } else if (updatePropertyInfo.TargetProperty === 'language') {
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
      document.getElementsByClassName("widget-scriptengineeditor-ParametersTextArea_" + uid)[0].oninput = () => {
        try {
          thisWidget.setProperty("parameters", JSON.parse(event.srcElement.value));
        } catch (exception) {
        }
      };
      document.getElementsByClassName("widget-scriptengineeditor-ParametersTextArea_" + uid)[0].onchange = () => {
        try {
          thisWidget.setProperty("parameters", JSON.parse(event.srcElement.value));
        } catch (exception) {
        }
      };
    }

    document.getElementsByClassName("widget-scriptengineeditor-ResultParameter_" + uid)[0].oninput = () => thisWidget.setProperty("resultParameter", event.srcElement.value);
    document.getElementsByClassName("widget-scriptengineeditor-ResultParameter_" + uid)[0].onchange = () => thisWidget.setProperty("resultParameter", event.srcElement.value);

    if (scriptengineEditor) {
      scriptengineEditor.getModel().onDidChangeContent(() => thisWidget.setProperty("code", scriptengineEditor.getModel().getValue()));
    } else {
      document.getElementsByClassName("widget-scriptengineeditor-ScriptEngineTextArea_" + uid)[0].oninput = () => thisWidget.setProperty("code", event.srcElement.value);
      document.getElementsByClassName("widget-scriptengineeditor-ScriptEngineTextArea_" + uid)[0].onchange = () => thisWidget.setProperty("code", event.srcElement.value);
    }

    document.getElementsByClassName("widget-scriptengineeditor-run_" + uid)[0].onclick = () => {
      if (!$(".widget-scriptengineeditor-run_" + uid).hasClass("widget-scriptengineeditor-run-disabled")) {
        thisWidget.setEnabled(false);

        var success = function (invoker) {
          document.getElementsByClassName("widget-scriptengineeditor-Result_" + uid)[0].value = JSON.stringify(invoker.result.rows[0].result.value);
          thisWidget.setEnabled(true);
        };

        var fail = function (invoker, xhr) {
          document.getElementsByClassName("widget-scriptengineeditor-Result_" + uid)[0].value = xhr.responseText;
          thisWidget.setEnabled(true);
        };

        var invoker = new ThingworxInvoker({
          entityType: 'Resources',
          entityName: 'ScriptEngineResource',
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
      document.getElementsByClassName("widget-scriptengineeditor-ParametersTextArea_" + uid)[0].value = parameters;
    }

    document.getElementsByClassName("widget-scriptengineeditor-ResultParameter_" + uid)[0].value = resultParameter;

    if (scriptengineEditor) {
      scriptengineEditor.getModel().setValue(code);
    } else {
      document.getElementsByClassName("widget-scriptengineeditor-ScriptEngineTextArea_" + uid)[0].value = code;
    }
  };

  this.setEnabled = function (enabled) {
    if (parametersEditor) {
      parametersEditor.updateOptions({readOnly: !enabled});
    } else {
      document.getElementsByClassName("widget-scriptengineeditor-ParametersTextArea_" + uid)[0].disabled = enabled ? "" : "disabled";
    }

    document.getElementsByClassName("widget-scriptengineeditor-ResultParameter_" + uid)[0].disabled = enabled ? "" : "disabled";

    if (scriptengineEditor) {
      scriptengineEditor.updateOptions({readOnly: !enabled});
    } else {
      document.getElementsByClassName("widget-scriptengineeditor-ScriptEngineTextArea_" + uid)[0].disabled = enabled ? "" : "disabled";
    }

    if (enabled) {
      $(".widget-scriptengineeditor-run_" + uid).removeClass("widget-scriptengineeditor-run-disabled");
    } else {
      $(".widget-scriptengineeditor-run_" + uid).addClass("widget-scriptengineeditor-run-disabled");
    }
  };

  this.beforeDestroy = function () {
    try {
      console.log("ScriptEngine Editor -> destroy editors");
      TW.log.info("ScriptEngine Editor -> destroy editors");
      if (parametersEditor) {
        parametersEditor.getModel().dispose();
        parametersEditor.dispose();
        parametersEditor = null;
      }
      if (scriptengineEditor) {
        scriptengineEditor.getModel().dispose();
        scriptengineEditor.dispose();
        scriptengineEditor = null;
      }
    } catch (err) {
      TW.log.error('ScriptEngine Editor Before Destroy Error', err);
    }
  };
};