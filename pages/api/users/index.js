import { usersRepo } from 'helpers';

export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getUsers();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    function getUsers() {
        const users = usersRepo.getAll();
        return res.status(200).json(users);
    }
}
