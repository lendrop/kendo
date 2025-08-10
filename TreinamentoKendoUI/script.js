$(function () {
  $("#grid").kendoGrid({
    height: "60%",
    selectable: "row",
    change: selecionado,
    columns: [
      { field: "id" },
      { field: "Nome" },
      { field: "Categoria" },
      { field: "Preco" },
      { field: "DataCadastro", type: "date", format: "{0:dd/MM/yyyy}" },
      { field: "Ativo", template: "#= Ativo ? 'Sim' : 'Nao' #" },
    ],
    columnMenu: true,
    dataSource: {
      transport: {
        read: function (options) {
          options.success(JSON.parse(localStorage.getItem("produtos")) || [])
        }
      }
    },
    pageable: {
      pageSize: 30,
      input: true,
      pageSizes: true,
    },
  });

  $("#toolbar").kendoToolBar({
    items: [
      { type: "spacer" },
      {
        type: "buttonGroup",
        buttons: [
          {
            text: "Incluir", click: function () {

              if (!$("#tela-cadastro").data("kendoWindow")) {
                $("#tela-cadastro").kendoWindow({
                  width: 300,
                  height: 300,
                  title: "Cadastro",
                  visible: false
                });
              }

              $("#textbox").val("");
              $("#categoria").data("kendoDropDownList").value(null);
              $("#preco").data("kendoNumericTextBox").value("");
              $("#data").val("");
              $("#ativo").data("kendoSwitch").value("");

              if (!$("#textbox").data("kendoTextBox")) {
                $("#textbox").kendoTextBox({
                  placeholder: "Digite o nome...",
                  width: 250,
                });
              }

              $("#textbox").closest(".k-textbox").show();

              $("#tela-cadastro").data("kendoWindow").center().open();

            }
          },
          {
            text: "Editar", enable: false, id: "btnEditar", click: function () {

              if (!$("#tela-cadastro").data("kendoWindow")) {
                $("#tela-cadastro").kendoWindow({
                  visible: false,
                  width: 300,
                  height: 300,
                  title: "Editar"
                });
              }

              if (!$("#textbox").data("kendoTextBox")) {
                $("#textbox").kendoTextBox({
                  placeholder: "Digite o nome..."
                });
              }

              $("#textbox").closest(".k-textbox").show();

              $("#tela-cadastro").data("kendoWindow").center().open();

            }
          },
        ]
      },
      {
      }
    ]
  });

  $("#categoria").kendoDropDownList({
    dataSource: [
      { name: "Eletronico" },
      { name: "Moveis" },
      { name: "Eletrodomestico" },
    ],
    dataTextField: "name",
    dataValueField: "name"
  });

  var categoria = $("#categoria").data("kendoDropDownList");
  categoria.dataSource.add({ name: "Comida" });
  categoria.search("A");

  $("#preco").kendoNumericTextBox({
    label: "Preco",
    format: "c0",
    decimals: 2,
    value: 0.00,
    min: 0
  });

  $("#data").kendoDatePicker({
    start: "year",
  });

  $("#ativo").kendoSwitch({
    messages: {
      checked: "ativo",
      unchecked: "inativo",
    },
    width: 80,
    checked: false,
    trackRounded: "small"
  })

  $("#botao-excluir").kendoButton().on("click", function () {
    $("#tela-cadastro").data("kendoWindow").close();
  });

  $("#botao-fechar").kendoButton({}).on("click", function () {
    $("#tela-cadastro").data("kendoWindow").close();
  });

  $("#botao-gravar").kendoButton().on("click", function () {

    if ($("#textbox").val() !== "") {

      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

      let novoId = 1;
      if (produtos.length > 0) {
        novoId = Math.max(...produtos.map(p => p.id)) + 1;
      }

      produtos.push({
        id: novoId,
        Nome: $("#textbox").val(),
        Categoria: $("#categoria").val(),
        Preco: parseFloat($("#preco").val()),
        DataCadastro: kendo.parseDate($("#data").val()),
        Ativo: $("#ativo").data("kendoSwitch").check()
      });

      localStorage.setItem("produtos", JSON.stringify(produtos));
      $("#grid").data("kendoGrid").dataSource.read(produtos);
      $("#tela-cadastro").data("kendoWindow").close();

    } else {
      $("#msgErroNome").show().delay(2000).fadeOut();
    }

    if ($("#categoria").val() !== "") {

    } else {
      $("#msgErroCategoria").show().delay(2000).fadeOut();
    }

    if ($("#data").val() !== "") {

    } else {
      $("#msgErroData").show().delay(2000).fadeOut();
    }

  });

  $("#tabstrip").kendoTabStrip({
    dataTextField: "Name",
    dataSource: [
      { Name: "Detalhes" },
    ]
  });

  $("#tab-nome").kendoTextBox({
    readonly: true
  });

  $("#tab-categoria").kendoTextBox({
    readonly: true
  });

  $("#tab-preco").kendoTextBox({
    readonly: true
  });

  $("#tab-data").kendoTextBox({
    readonly: true
  });

  $("#tab-ativo").kendoTextBox({
    readonly: true
  });

  function selecionado() {
    var grid = $("#grid").data("kendoGrid");
    var linhaSelecionada = grid.select();
    var dataSelecionada = grid.dataItem(linhaSelecionada);

    if (dataSelecionada) {
      $("#botao-excluir").kendoButton().on("click", function () {
        grid.dataSource.remove(dataSelecionada);

        var novosDados = grid.dataSource.data().toJSON();
        localStorage.setItem("produtos", JSON.stringify(novosDados));
      });

      $("#tab-nome").val(dataSelecionada.Nome);
      $("#tab-categoria").val(dataSelecionada.Categoria);
      $("#tab-preco").val(dataSelecionada.Preco);
      $("#tab-data").val(dataSelecionada.DataCadastro);

      if (dataSelecionada.Ativo === true) {
        $("#tab-ativo").val("Sim");
      } else {
        $("#tab-ativo").val("Nao");
      }

      $("#toolbar").data("kendoToolBar").enable("#btnEditar")

      $("#btnEditar").on("click", function () {

        $("#textbox").val(dataSelecionada.Nome);
        $("#categoria").data("kendoDropDownList").value(dataSelecionada.Categoria);
        $("#preco").data("kendoNumericTextBox").value(dataSelecionada.Preco);
        $("#data").data("kendoDatePicker").value(dataSelecionada.DataCadastro);
        $("#ativo").data("kendoSwitch").value(dataSelecionada.Ativo);

  $("#botao-gravar").off("click").on("click", function () {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    const index = produtos.findIndex(p => p.id === dataSelecionada.id);

    if (index !== -1) {
      produtos[index] = {
        id: dataSelecionada.id,
        Nome: $("#textbox").val(),
        Categoria: $("#categoria").val(),
        Preco: parseFloat($("#preco").val()),
        DataCadastro: kendo.parseDate($("#data").val()),
        Ativo: $("#ativo").data("kendoSwitch").check()
      };

      localStorage.setItem("produtos", JSON.stringify(produtos));

      $("#grid").data("kendoGrid").dataSource.data(produtos);
    }

    $("#tela-cadastro").data("kendoWindow").close();
  });

      });

    }
  }

});
