// lib/data/getFeverData.js
import archiveResponses from "./gpArchive.json";

export function getFeverData() {
  const QUESTION_GROUPS = [
    { id: "1-1", label: "01", title: "다시 신입생이 된다면", subtitle: "나에게 해주고 싶은 말은?" },
    { id: "1-2", label: "02", title: "나만의 학교 적응", subtitle: "팁을 공유해주세요!" },
    { id: "2-1", label: "03", title: "첫 동기와 함께 했던", subtitle: "잊을 수 없는 추억은?" },
    { id: "2-2", label: "04", title: "가장 첫인상이 강렬했던", subtitle: "교수님 또는 친구는?" },
  ];

  const grouped = QUESTION_GROUPS.reduce((acc, group) => {
    acc[group.id] = [];
    return acc;
  }, {});

  archiveResponses.forEach((person) => {
    person.answers.forEach((entry) => {
      const [key, value] = Object.entries(entry)[0];
      if (!key || !value) return;
      const [section, question] = key.split("-");
      if (!section || !question) return;
      const groupId = `${section}-${question}`;
      if (!grouped[groupId]) return;

      const nickNameField = (groupId === "1-1" || groupId === "1-2") ? "nickName01" : "nickName02";
      const nickName = person[nickNameField] || person.name;

      grouped[groupId].push({
        text: value,
        nicName: nickName,
        role: person.role || "",
      });
    });
  });

  return grouped;
}
