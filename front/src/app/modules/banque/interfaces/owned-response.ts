export interface OwnedPokemon{
    name_fr: String,
    name_en: String,
    userPseudo: String,
    tags: Array<Tags>
}

interface Tags {
    name_fr: String,
    name_en: String,
    type: String
}