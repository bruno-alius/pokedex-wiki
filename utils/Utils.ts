export function stringToSlug(string: string): string {
    return string
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'nh');
}

export const defaultLinkProps = {
    spy: true,
    duration: 500,
    delay: 0,
    smooth: true,
    offset: -90,
  };