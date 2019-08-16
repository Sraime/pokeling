export interface OwnedPokemon{
    _id: String,
    name_fr: String,
    userPseudo: String,
    tags: Array<Tags>
}

interface Tags {
    name_fr: String,
    name_en: String,
    type: String
}