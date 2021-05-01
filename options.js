let ErrataList;

function generateTbody(table) {
  let tbody = document.createElement("tbody");
  for (let i = 0; i < ErrataList.length; i++) {
    let row = tbody.insertRow();

    let idx_cell = row.insertCell();
    let idx_text = document.createTextNode(i + 1);
    idx_cell.appendChild(idx_text);

    let errata_cell = row.insertCell();
    let errata_text = document.createTextNode(ErrataList[i][0]);
    errata_cell.appendChild(errata_text);

    let correction_cell = row.insertCell();
    let correction_text = document.createTextNode(ErrataList[i][1]);
    correction_cell.appendChild(correction_text);
  }
  tbody.innerHTML = tbody.innerHTML.replace(/ /g, `<span style="background-color: #FFDD81">&nbsp;</span>`);
  table.appendChild(tbody);
}

$(function () {
  $('input:radio[name="checkList"]:radio[value="select_all"]').attr("checked", true);

  let url = chrome.runtime.getURL("data/ErrataList.csv");
  $.get(url, function (data) {
    ErrataList = $.csv.toArrays(data);
    let table = document.getElementById("ErrataTable");

    generateTbody(table);
  });

  $('input[name="checkList"]').click(function () {
    const selected = $("input[name='checkList']:checked")[0].value;
    if (selected == "select_all") {
      url = chrome.runtime.getURL("data/ErrataList.csv");
    } else if (selected == "noun") {
      url = chrome.runtime.getURL("data/ErrataList_noun.csv");
    } else if (selected == "verb") {
      url = chrome.runtime.getURL("data/ErrataList_verb.csv");
    } else if (selected == "adverb") {
      url = chrome.runtime.getURL("data/ErrataList_adverb.csv");
    }

    $.get(url, function (data) {
      ErrataList = $.csv.toArrays(data);
      $("tbody").remove();
      let table = document.getElementById("ErrataTable");
      generateTbody(table);
    });
  });
});
