import type { Asset, EntryFields } from "contentful";

export type GeneralContent = {
    id?: EntryFields.Symbol;
    navbarLogo?: Asset;
    invertWelcomeButtons?: EntryFields.Boolean;
    hideContactOptionInSpecificSections?: EntryFields.Boolean;
    highlightContactOption?: EntryFields.Boolean;
    invertContactSection?: EntryFields.Boolean;
    welcomeSlogan?: EntryFields.Text;
    welcomeMainText: EntryFields.Text;
    welcomeMainButton?: EntryFields.Text;
    welcomeSecondaryButton?: EntryFields.Text;
    section2NavbarTitle: EntryFields.Symbol;
    servicesTitle?: EntryFields.Text;
    service1title?: EntryFields.Text;
    service1Description: EntryFields.Text;
    service2title?: EntryFields.Text;
    service2Description: EntryFields.Text;
    service3title?: EntryFields.Text;
    service3Description: EntryFields.Text;
    section2ServicesService3CustomImage?: EntryFields.Symbol;
    section3NavbarTitle: EntryFields.Symbol;
    projectsTitle?: EntryFields.Text;
    projectsSubtitle?: EntryFields.Text;
    section3ProjectsShowNew?: EntryFields.Boolean;
    section3ProjectsNew?: NewProject[];
    projectVisitButton: EntryFields.Symbol;
    section4NavbarTitle: EntryFields.Symbol;
    contactTitle?: EntryFields.Text;
    contactName?: EntryFields.Text;
    contactMail?: EntryFields.Symbol;
    contactMessage: EntryFields.Symbol;
    buttonText?: EntryFields.Text;
    contactMainText: EntryFields.Text;
    section4ContactMainTextMobile: EntryFields.Text;
    contactSuccessMessage?: EntryFields.Text;
    contactErrorMessage?: EntryFields.Text;
    contactEmail?: EntryFields.Symbol;
    contactCtaSubtitle?: EntryFields.Text;
    section4ContactPhoneNumber?: EntryFields.Symbol;
    section4ContactWhatsappButtonText?: EntryFields.Symbol;
    seoTitle: EntryFields.Text;
    seoDescription: EntryFields.Text;
    cookiesText?: EntryFields.Text;
    acceptCookies?: EntryFields.Symbol;
    denyCookies?: EntryFields.Symbol;
    cookiesTitle?: EntryFields.Text;
}

export type NewProject = {
    title: EntryFields.Symbol;
    description: EntryFields.Text;
    image?: Asset;
    link?: EntryFields.Symbol;
    position?: EntryFields.Integer;
}

export type Project = {
    title: EntryFields.Symbol;
    description: EntryFields.Text;
    image?: Asset;
    link?: EntryFields.Symbol;
    position?: EntryFields.Integer;
}

export type ContentfulData = {
    generalContentEntries: GeneralContent[];
    newProjectEntries: NewProject[];
    projectEntries: Project[];
}