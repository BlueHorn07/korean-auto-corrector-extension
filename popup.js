$(function () {
  chrome.storage.sync.get(["noun", "verb", "adverb"], function (checklist) {
    if (checklist.noun && checklist.verb && checklist.adverb) {
      $("#check_all").prop("checked", true);
    }
    if (checklist.noun) {
      $("#noun").prop("checked", true);
    }
    if (checklist.verb) {
      $("#verb").prop("checked", true);
    }
    if (checklist.adverb) {
      $("#adverb").prop("checked", true);
    }
  });

  $("#check_all").click(function () {
    if ($("#check_all").prop("checked")) {
      $('input[name="checkList"]').prop("checked", true);
    } else {
      $('input[name="checkList"]').prop("checked", false);
    }
  });

  $("input[name='checkList']").click(function () {
    let checklist = $("input[name='checkList']:checked");
    console.log(checklist);
    if (checklist.length < 4) {
      if (checklist.length == 3 && checklist[0].id == "noun" && checklist[1].id == "verb" && checklist[2].id == "adverb") {
        $("#check_all").prop("checked", true);
      } else {
        $("#check_all").prop("checked", false);
      }
    }
  });

  $("#save").click(function () {
    chrome.storage.sync.set({ noun: false, verb: false, adverb: false }, function () {
      $("input[name='checkList']:checked").each(function () {
        if ($(this).val() == "check_all") {
          chrome.storage.sync.set({ noun: true, verb: true, adverb: true }, function () {});
        } else {
          if ($(this).val() == "noun") {
            chrome.storage.sync.set({ noun: true }, function () {});
          }
          if ($(this).val() == "verb") {
            chrome.storage.sync.set({ verb: true }, function () {});
          }
          if ($(this).val() == "adverb") {
            chrome.storage.sync.set({ adverb: true }, function () {});
          }
        }
      });
    });
  });
});
