var ErrataList;
var ErrataLength;

function correction_recurr(super_paragraph) {
  let paragraph = super_paragraph.childNodes;
  for (let i = 0; i < paragraph.length; i++) {
    if (paragraph[i].nodeType == Node.TEXT_NODE) {
      if (paragraph[i].textContent.trim()) {
        for (let j = 0; j < ErrataLength; j++) {
          paragraph[i].textContent = paragraph[i].textContent.replace(new RegExp(ErrataList[j][0], "gi"), ErrataList[j][1]);
        }
      }
    } else if (paragraph[i].nodeType == Node.ELEMENT_NODE) {
      const tagName = paragraph[i].tagName;
      if (tagName != "STYLE" && tagName != "SCRIPT" && tagName != "LINK") {
        if (tagName != "IMG" && tagName != "A" && tagName != "INPUT") {
          correction_recurr(paragraph[i]);
        }
      }
    }
  }
}

if (document.documentElement.lang == "ko" || document.documentElement.lang == "ko-KR") {
  chrome.storage.sync.get(["noun", "verb", "adverb"], function (checklist) {
    if (checklist.noun && checklist.verb && checklist.adverb) {
      loadAllErrataList();
    } else {
      loadNounErrataList(checklist);
    }
  });
}

function loadAllErrataList() {
  const url = chrome.runtime.getURL("data/ErrataList.csv");

  $.get(url, function (data) {
    ErrataList = $.csv.toArrays(data);
    ErrataLength = ErrataList.length;
    console.time("Errata");
    correction_recurr(document.body);
    console.timeEnd("Errata");
  });
}

function loadNounErrataList(checklist) {
  if (checklist.noun) {
    const url = chrome.runtime.getURL("data/ErrataList_noun.csv");

    $.get(url, function (data) {
      ErrataList = $.csv.toArrays(data);
      loadVerbErrataList(checklist);
    });
  } else {
    loadVerbErrataList(checklist);
  }
}

function loadVerbErrataList(checklist) {
  if (checklist.verb) {
    const url = chrome.runtime.getURL("data/ErrataList_verb.csv");

    $.get(url, function (data) {
      if (ErrataList) {
        ErrataList = ErrataList.concat($.csv.toArrays(data));
      } else {
        ErrataList = $.csv.toArrays(data);
      }
      loadAdverbErrataList(checklist);
    });
  } else {
    loadAdverbErrataList(checklist);
  }
}

function loadAdverbErrataList(checklist) {
  if (checklist.adverb) {
    const url = chrome.runtime.getURL("data/ErrataList_adverb.csv");

    $.get(url, function (data) {
      if (ErrataList) {
        ErrataList = ErrataList.concat($.csv.toArrays(data));
      } else {
        ErrataList = $.csv.toArrays(data);
      }
      ErrataLength = ErrataList.length;
      correction_recurr(document.body);
    });
  } else {
    ErrataLength = ErrataList.length;
    correction_recurr(document.body);
  }
}
