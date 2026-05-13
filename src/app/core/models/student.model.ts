
// Enums

export enum Sexe {
    MASCULIN = 'Masculin',
    FEMININ = 'Féminin',
    AUTRE = 'Autre'
}

export enum Niveau {
    L1 = 'Licence 1',
    L2 = 'Licence 2',
    L3 = 'Licence 3',
    M1 = 'Master 1',
    M2 = 'Master 2',
    DOCTORAT = 'Doctorat'
}

//  INTERFACE PRINCIPALE

export interface Student {
    id: string;
    matricule : string;
    nom: string;
    prenoms: string;
    sexe: Sexe;
    dateNaissance: string;
    niveau: Niveau;
    email: string;
    adresse: string;
    telephone: string;
}

//  TYPES UTILITAIRES

export type StudentFormDate = Omit<Student, 'id'>; // Type pour les formulaires, sans l'id qui est généré automatiquement

export type StudentSummary = Pick<Student, 'id' | 'matricule' | 'nom' | 'prenoms' | 'niveau' | 'sexe'>; // Type pour les listes, avec seulement les champs essentiels