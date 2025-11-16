from backend.app.services.ai_companion import query_supabase_rpc

def retrieve_relevant_docs(): 

    q = "Need data related to signing check requests"
    prompt, docs = query_supabase_rpc(q, k=5)

    print(prompt)
    print("-------------")
    print(docs)

    return prompt


if __name__ == "__main__":
    retrieve_relevant_docs()