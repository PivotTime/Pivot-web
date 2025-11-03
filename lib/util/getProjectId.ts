export function getProjectIdByName(name: string): string | undefined {
  switch (name) {
    case 'PIVOT TIME':
      return 'PIVOTTIME';
    case 'MEMO:Re':
      return 'MEMORE';
    case '빛결':
      return 'lighttexture';
    case '한올':
      return 'HANALL';
    case 'O.K':
      return 'OK';
    case 'Pinimo':
      return 'Pinimo';
    case '피하몽':
      return 'Pihamon';
    case 'Cops':
      return 'COPS';
    case 'Qpid':
      return 'Qpid';
    case '아트랑':
      return 'ARTRANG';
    case 'Boutine':
      return 'Boutine';
    case 'J와P':
      return 'JandP';
    case 'NOL:EUM':
      return 'NOLEUM';
    case 'BEYOND THE ABYSS':
      return 'BEYONDTHEABYSS';
    case 'Melt0℃':
      return 'Melt0C';
    case 'Log!n':
      return 'Login';
    case 'project H.':
      return 'ProjectH';
    case 'GYEOB':
      return 'Gyeob';
    case '돈쭐':
      return 'DONZZUL';
    case 'EvidenceClicker':
      return 'EvidenceCliker';
    default:
      return undefined;
  }
}
