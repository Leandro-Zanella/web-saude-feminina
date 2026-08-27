export function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
}
